class ScormEngineService
  include ScormCommonService

  def initialize(tenant = "default")
    api_interface = Rails.application.secrets.scorm_api_path
    @scorm_url = Rails.application.secrets.scorm_url
    @scorm_tenant_url = Rails.application.secrets.scorm_url + api_interface + tenant
    @api_username = Rails.application.secrets.scorm_api_username
    @api_password = Rails.application.secrets.scorm_api_password
  end

  def launch_course(registration, redirect_url, postback_url, result_params = {}, lti_credentials = {})
    launch_link = get_launch_link(
      registration,
      redirect_url,
      postback_url,
      result_params,
      lti_credentials,
    )
    setup_url_response(launch_link)
  end

  def setup_scorm_registration(registration, user, postback_url, lti_key, course_id)
    body = {
      registrationId: registration.scorm_registration_id,
      courseId: course_id,
      learner: {
        id: user[:lms_user_id],
        firstName: user[:last_name],
        lastName: user[:first_name],
      },
      postBack: {
        url: postback_url,
        password: registration.scorm_cloud_passback_secret,
        userName: lti_key,
        resultsFormat: "FULL",
      },
    }
    url = "#{@scorm_tenant_url}/registrations"
    send_post_request(url, body)
  end

  def list_courses(options = {})
    courses = {}
    url = "#{@scorm_tenant_url}/courses"
    body_courses, response = get_courses(url, options)
    courses[:response] = get_merged_list(body_courses)
    courses[:status] = response.code
    courses
  end

  ##
  # Recursively get all courses
  def get_courses(url, options = {})
    response = send_get_request(url, options)
    body = JSON.parse(response.body)
    body_courses = body["courses"]
    more_url = body["more"]
    if more_url.present?
      more_url_parsed = URI.parse(more_url)
      options[:more] = Rack::Utils.parse_nested_query(more_url_parsed.query)["more"]
      more_body_courses, response = get_courses(url, options)
      body_courses << more_body_courses
      body_courses.flatten!
    end
    [body_courses, response]
  end

  def upload_scorm_course(file, course_id, _cleanup)
    import_course_file(file, course_id)
  end

  def update_scorm_course(file, course_id)
    import_course_file(file, course_id)
  end

  def import_course_file(file, course_id)
    params = {
      course: course_id,
      mayCreateNewVersion: true,
    }.to_query
    url = "#{@scorm_tenant_url}/courses/importJobs?#{params}"

    response = RestClient::Request.execute(
      method: :post,
      url: url,
      user: @api_username,
      password: @api_password,
      payload: {
        file: File.new(file),
      },
    )
    JSON.parse(response.body)["result"]
  end

  def upload_scorm_course_url(file_url, course_id, _cleanup)
    import_course_url(file_url, course_id)
  end

  def update_scorm_course_url(file_url, course_id)
    import_course_url(file_url, course_id)
  end

  def import_course_url(file_url, course_id)
    params = {
      course: course_id,
      mayCreateNewVersion: true,
    }.to_query
    url = "#{@scorm_tenant_url}/courses/importJobs?#{params}"

    body = {
      url: file_url,
      courseName: course_id,
    }

    response = RestClient::Request.execute(
      method: :post,
      headers: {
        accept: :json,
        content_type: :json,
      },
      url: url,
      user: @api_username,
      password: @api_password,
      payload: body.to_json,
    )
    JSON.parse(response.body)["result"]
  end

  ##
  # Loop to check the import progress
  # Stop looping when the job finishes
  # Or when the backoff is greater than 36
  # Which is equivalent to 234 seconds or nearly 4 minutes
  ##
  def check_import_progress(import_job_id)
    url = "#{@scorm_tenant_url}/courses/importJobs/#{import_job_id}"
    status = "RUNNING"
    backoff = 0
    loop do
      response = send_get_request(url)
      response_body = JSON.parse(response.body)
      status = response_body["status"]

      raise Adhesion::Exceptions::ScormImport.new(response_body.to_json) if status == "ERROR"

      break if status == "COMPLETE" || backoff > 36
      backoff += 3
      sleep backoff
    end
    status
  end

  def get_scorm_title(course_id)
    url = "#{@scorm_tenant_url}/courses/#{course_id}/title"
    response = send_get_request(url)
    JSON.parse(response.body)["title"]
  end

  def show_course(course_id)
    url = "#{@scorm_tenant_url}/courses/#{course_id}"
    send_get_request(url)
  end

  def remove_scorm_course(course_id)
    url = "#{@scorm_tenant_url}/courses/#{course_id}"
    send_delete_request(url)
  end

  def remove_scorm_registration(registration_id)
    url = "#{@scorm_tenant_url}/registrations/#{registration_id}"
    send_delete_request(url)
  end

  def preview_course(course_id, redirect_url)
    redirect_on_exit_url = if redirect_url.present?
      redirect_url
    else
      "noop_message=Preview is over. Please close this window."
    end
    body = { redirectOnExitUrl: redirect_on_exit_url }
    url = "#{@scorm_tenant_url}/courses/#{course_id}/preview"
    response = send_get_request(url, body)
    launch_link = JSON.parse(response.body)["launchLink"]
    setup_url_response(launch_link)
  end

  def course_metadata(course_id)
    # not sure there is an api metadata call currently
    url = "#{@scorm_tenant_url}/courses/#{course_id}"
    send_get_request(url)
  end

  def course_manifest(course_id)
    # not sure there is an api manifest call currently
    url = "#{@scorm_tenant_url}/courses/#{course_id}"
    send_get_request(url)
  end

  def registration_scorm_result(registration_id)
    url = "#{@scorm_tenant_url}/registrations/#{registration_id}/progress"
    response = send_get_request(url)
    result = JSON.parse response.body
    result[:response] = {}
    result[:response]["rsp"] = {}
    result[:response]["rsp"]["stat"] = result["registrationSuccess"] == "FAILED" ? "fail" : "ok"
    result[:response]["rsp"]["registrationreport"] = {}
    result[:response]["rsp"]["registrationreport"]["regid"] = result["id"]
    result[:response]["rsp"]["registrationreport"]["score"] = result["score"] ? result["score"]["scaled"] : "unknown"
    result
  end

  def get_course_ids(courses)
    courses.map { |i| i["id"] }
  end

  def get_title(courses, course)
    courses.detect { |c| c["id"] == course["title"] }
  end

  def get_scorm_course(course)
    ScormCourse.find_by(scorm_service_id: course["id"])
  end

  def get_course_title(course)
    course["title"]
  end

  private

  def get_merged_list(courses)
    courses.
      group_by { |c| c["id"] }.
      map do |course_group|
        groups = course_group.last
        if groups.count > 1
          groups.sort_by { |a| a[:version] }
        end
        groups.last
      end
  end

  def get_launch_link(registration, redirect_url, postback_url, result_params, lti_credentials)
    url = "#{@scorm_tenant_url}/registrations/#{registration.scorm_registration_id}/launchLink"
    params = { redirectOnExitUrl: redirect_url }
    response = send_get_request(url, params)
    JSON.parse(response.body)["launchLink"]
  rescue RestClient::NotFound
    create_scorm_registration(postback_url, result_params, registration, lti_credentials)
    response = send_get_request(url, params)
    JSON.parse(response.body)["launchLink"]
  end

  def send_get_request(url, params = {})
    RestClient::Request.execute(
      method: :get,
      url: url,
      user: @api_username,
      password: @api_password,
      headers: {
        accept: :json,
        content_type: :json,
        params: params,
      },
    )
  end

  def send_post_request(url, body = {}, content_type = :json)
    RestClient::Request.execute(
      method: :post,
      url: url,
      user: @api_username,
      password: @api_password,
      headers: {
        accept: content_type,
        content_type: content_type,
      },
      payload: body.to_json,
    )
  end

  def send_delete_request(url)
    RestClient::Request.execute(
      method: :delete,
      url: url,
      user: @api_username,
      password: @api_password,
    ) do |response|
      {
        status: response.code,
        response: [200, 204].include?(response.code),
      }
    end
  end

  def setup_url_response(launch_link)
    if launch_link
      response = @scorm_url + launch_link
      status = 200
    else
      status = 500
    end
    {
      response: response,
      status: status,
    }
  end
end
