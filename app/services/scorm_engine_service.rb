require "net/http"
require "net/http/post/multipart"
include ScormCommonService

class ScormEngineService

  def initialize(tenant = "default")
    api_interface = Rails.application.secrets.scorm_api_url
    @scorm_ssl_domain = Rails.application.secrets.scorm_ssl_domain
    @scorm_tenant_url = Rails.application.secrets.scorm_domain + api_interface + tenant
    @api_username = Rails.application.secrets.scorm_api_username
    @api_password = Rails.application.secrets.scorm_api_password
  end

  def launch_course(registration, _redirect_url)
    launch_link = get_launch_link(registration[:id])
    setup_url_response(launch_link)
  end

  def setup_scorm_registration(registration, user, postback_url, lti_key, course_id)
    body = {
      registrationId: registration[:id],
      courseId: course_id,
      learner: {
        id: user[:lms_user_id],
        firstName: user[:last_name],
        lastName: user[:first_name],
      },
      postBack: {
        url: postback_url,
        password: registration[:scorm_cloud_passback_secret],
        userName: lti_key,
      },
    }
    url = @scorm_tenant_url + "/registrations"
    response = send_post_request(url, body)
    response
  end

  def list_courses(options = {})
    courses = {}
    url = @scorm_tenant_url + "/courses"
    response = send_get_request(url, options)
    courses[:response] = (JSON.parse response.body)["courses"]
    courses[:status] = response[:status]
    courses
  end

  def upload_scorm_course(file, package_id, _cleanup)
    uri = URI(@scorm_tenant_url + "/courses/importJobs")
    File.open(File.new(file.path)) do |zip|
      request = Net::HTTP::Post::Multipart.new "#{uri.path}?course=#{package_id}",
                                               "file": UploadIO.new(zip, "zip/zip", file.original_filename)
      Net::HTTP.start(uri.host, uri.port) do |http|
        request.basic_auth @api_username, @api_password
        response = http.request(request)
        response
      end
    end
  end

  def show_course(course_id)
    url = @scorm_tenant_url + "/courses/#{course_id}"
    send_get_request(url)
  end

  def remove_scorm_course(course_id)
    url = @scorm_tenant_url + "/courses/#{course_id}"
    send_delete_request(url)
  end

  def remove_scorm_registration(registration_id)
    url = @scorm_tenant_url + "/registrations/#{registration_id}"
    send_delete_request(url)
  end

  def preview_course(course_id, redirect_url)
    body = { redirectOnExitUrl: redirect_url } if redirect_url
    url = @scorm_tenant_url + "/courses/#{course_id}/preview"
    response = send_get_request(url, body)
    launch_link = (JSON.parse response.body)["launchLink"]
    setup_url_response(launch_link)
  end

  def course_metadata(course_id)
    # not sure there is an api metadata call currently
    url = @scorm_tenant_url + "/courses/#{course_id}"
    send_get_request(url)
  end

  def course_manifest(course_id)
    # not sure there is an api manifest call currently
    url = @scorm_tenant_url + "/courses/#{course_id}"
    send_get_request(url)
  end

  def registration_scorm_result(registration_id)
    url = @scorm_tenant_url + "/registrations/#{registration_id}/progress"
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
    courses.detect { |c| c["id"] == course["scorm_cloud_id"] }["title"]
  end

  def get_scorm_course(course)
    ScormCourse.find_by(scorm_cloud_id: course["id"])
  end

  def get_course_title(course)
    course["title"]
  end

  private

  def get_launch_link(registration_id)
    url = @scorm_tenant_url + "/registrations/#{registration_id}/launchLink"
    response = send_get_request(url)
    (JSON.parse response.body)["launchLink"]
  end

  def send_get_request(url, body = {})
    uri = URI(url)
    Net::HTTP.start(uri.host, uri.port) do |http|
      request = Net::HTTP::Get.new(uri, "Content-Type" => "application/json")
      request.basic_auth @api_username, @api_password
      request.body = body.to_json
      response = http.request request
      response[:status] = response.code
      response
    end
  end

  def send_post_request(url, body = {}, content_type = "application/json")
    uri = URI(url)
    Net::HTTP.start(uri.host, uri.port) do |http|
      request = Net::HTTP::Post.new(uri)
      request.basic_auth @api_username, @api_password
      request.body = body.to_json
      request.content_type = content_type
      response = http.request request
      response[:status] = response.code
      response
    end
  end

  def send_delete_request(url)
    uri = URI(url)
    Net::HTTP.start(uri.host, uri.port) do |http|
      request = Net::HTTP::Delete.new(uri)
      request.basic_auth @api_username, @api_password
      response = http.request request
      response[:status] = response.code
      response
    end
  end

  def setup_url_response(launch_link)
    if launch_link
      response = @scorm_ssl_domain + launch_link
      status = 200
    else
      status = 500
    end
    {
      response,
      status,
    }
  end

end
