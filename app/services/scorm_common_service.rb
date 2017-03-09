module ScormCommonService

  SCORM_ASSIGNMENT_STATE = {
    GRADED: "GRADED",
    UNGRADED: "UNGRADED",
  }.freeze

  def sync_courses(courses)
    if courses
      course_ids = get_course_ids(courses)
      existing_course_ids = ScormCourse.all.map { |c| c[:scorm_cloud_id] }
      extra = existing_course_ids - course_ids
      remove_extras(extra)
      needed = course_ids - existing_course_ids
      update_scorm_courses(courses, needed)
      get_sync_result(courses)
    end
  end

  def upload_course(file, lms_course_id)
    course = ScormCourse.create
    cleanup = Proc.new { course.destroy }
    package_id = "#{course.id}_#{lms_course_id}"
    response = upload_scorm_course(file, package_id, cleanup)
    course.update_attributes(title: response[:title], scorm_cloud_id: package_id)
    response["course_id"] = course.id
    response
  end

  def remove_course(course_id)
    response = remove_scorm_course(course_id)
    if response[:response] == true
      course = ScormCourse.find_by(scorm_cloud_id: course_id)
      registrations = Registration.where(lms_course_id: course_id.to_i)
      registrations.each do |registration|
        remove_scorm_registration(registration.id)
        registration.destroy
      end
      course&.destroy
    end
    response
  end

  def get_registration(postback_url, result_params = {}, lti_credentials = {})
    registration = find_registration(
      result_params[:course_id],
      result_params[:custom_canvas_user_id],
    )
    if registration.nil?
      registration = create_local_registration(result_params, lti_credentials)
      user = {
        first_name: result_params[:lis_person_name_given],
        last_name: result_params[:lis_person_name_family],
        lms_user_id: result_params[:custom_canvas_user_id],
      }
      setup_scorm_registration(
        registration,
        user,
        postback_url,
        lti_credentials.lti_key,
        result_params[:course_id],
      )
    end
    registration
  end

  ### Sync Utilities
  ## Assist in keeping scorm cloud, canvas, and local tables in sync

  def sync_registration(registration_params)
    result = registration_result(
      registration_params[:course_id],
      registration_params[:custom_canvas_user_id],
    )
    if result && result[:response]["rsp"]["stat"] == "fail"
      sync_registration_score(result[:response]["rsp"]["registrationreport"])
    end
  end

  def sync_registration_score(reg_result)
    reg = Registration.find(reg_result["regid"])
    reg.score = package_score(reg_result["score"])
    if package_complete?(reg_result) && reg.changed?
      response = post_results(reg, reg_result)
      print_response(reg, response)
    end
  end

  private

  def create_local_registration(result_params, lti_credentials)
    registration_params = reg_params(result_params)
    registration = Registration.create(registration_params)
    registration.application_instance = lti_credentials
    registration.save!
    registration
  end

  def remove_extras(extra)
    extra.each do |scorm_cloud_id|
      ScormCourse.find_by(scorm_cloud_id: scorm_cloud_id).destroy
      registrations = Registration.where(lms_course_id: scorm_cloud_id.to_i)
      registrations.each do |reg|
        remove_scorm_registration(reg.id)
        reg.destroy
      end
    end
  end

  def update_scorm_courses(courses, needed)
    new_courses = []
    needed.each { |scorm_cloud_id| new_courses << ScormCourse.create(scorm_cloud_id: scorm_cloud_id) }
    new_courses.each do |course|
      title = get_title(courses, course)
      course.update_attribute(:title, title)
    end
  end

  def get_sync_result(courses)
    courses.map do |course|
      local_course = get_scorm_course(course)
      if !local_course.nil?
        resp = {
          title: get_course_title(course),
          id: local_course.scorm_cloud_id,
        }
        if local_course.lms_assignment_id.nil? == false
          resp[:lms_assignment_id] = local_course.lms_assignment_id
          resp[:is_graded] = if !local_course.points_possible.nil? && local_course.points_possible > 0
                               SCORM_ASSIGNMENT_STATE[:GRADED]
                             else
                               SCORM_ASSIGNMENT_STATE[:UNGRADED]
                             end
        end
        resp
      end
    end
  end

  def registration_result(lms_course_id, lms_user_id)
    registration = find_registration(lms_course_id, lms_user_id)
    registration_scorm_result(registration.id) if registration
  end

  def reg_params(params)
    resp = {}
    resp[:id] = params[:id] unless params[:id].nil?
    resp[:lms_course_id] = params[:course_id] unless params[:course_id].nil?
    resp[:lms_user_id] = params[:custom_canvas_user_id] unless params[:custom_canvas_user_id].nil?
    resp[:lis_result_sourcedid] = params[:lis_result_sourcedid] unless params[:lis_result_sourcedid].nil?
    resp[:lis_outcome_service_url] = params[:lis_outcome_service_url] unless params[:lis_outcome_service_url].nil?
    resp
  end

  def find_registration(lms_course_id, lms_user_id)
    course_id = lms_course_id ? lms_course_id.gsub("_", "") : ""
    Registration.find_by(
      lms_course_id: course_id,
      lms_user_id: lms_user_id,
    )
  end

  def post_results(reg, reg_results)
    tp_params = setup_provider_params(reg_results)
    provider = IMS::LTI::ToolProvider.new(
      reg.application_instance.lti_key,
      reg.application_instance.lti_secret,
      tp_params,
    )
    provider.post_replace_result!(reg.score)
  end

  def setup_provider_params(reg)
    {
      "lis_outcome_service_url" => reg[:lis_outcome_service_url],
      "lis_result_sourcedid" => reg[:lis_result_sourcedid],
      "user_id" => reg[:lms_user_id],
    }
  end

  def print_response(reg, response)
    if response.success?
      reg.save!
    elsif response.processing?
      raise "A processing error has occurred"
    elsif response.unsupported?
      raise "Not supported"
    else
      raise "A failure has occurred. Please try again."
    end
  end

  def package_complete?(reg_result)
    reg_result["complete"] == "complete"
  end

  def package_score(score)
    score.to_i / 100.0
  end

end
