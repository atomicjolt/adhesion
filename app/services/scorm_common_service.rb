module ScormCommonService

  SCORM_ASSIGNMENT_STATE = {
    GRADED: "GRADED",
    UNGRADED: "UNGRADED",
  }.freeze

  def upload_course(file, lms_course_id)
    course = ScormCourse.create
    cleanup = Proc.new { course.destroy }
    package_id = "#{course.id}_#{lms_course_id}"
    resp = upload_engine_course(file, package_id, cleanup)
    course.update_attributes(title: resp[:title], scorm_cloud_id: package_id)
    resp["package_id"] = package_id
    resp["course_id"] = course.id
    resp
  end

  def remove_course(course_id)
    response = remove_engine_course(course_id)
    if response == true
      course = ScormCourse.find_by(scorm_cloud_id: course_id)
      registrations = Registration.where(lms_course_id: course_id.to_i)
      registrations.each do |registration|
        remove_engine_registration(registration.id)
        registration.destroy
      end
      course&.destroy
    end
  end

  def get_registration(postback_url, result_params = {}, lti_credentials = {})
    registration = find_registration(
      result_params[:course_id],
      result_params[:custom_canvas_user_id],
    )
    if registration.nil?
      registration = create_local_registration(result_params)
      user = {
        first_name: params[:lis_person_name_given],
        last_name: params[:lis_person_name_family],
        lms_user_id: params[:custom_canvas_user_id],
      }
      setup_engine_registration(registration, user, postback_url, lti_credentials)
    end
    registration
  end

  def registration_result(lms_course_id, lms_user_id)
    registration = find_registration(lms_course_id, lms_user_id)
    resp = registration_engine_result(registration.id)
    Hash.from_xml(resp)
  end

  def create_local_registration(result_params, lti_credentials)
    registration_params = reg_params(result_params)
    registration = Registration.create(registration_params)
    registration.application_instance = lti_credentials
    registration.save!
    registration
  end

  private

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
    Registration.find_by(
      lms_course_id: lms_course_id,
      lms_user_id: lms_user_id,
    )
  end

  def sync_registration(registration_params)
    result = registration_result(
      registration_params[:course_id],
      registration_params[:custom_canvas_user_id],
    )
    return if result.nil?
    sync_registration_score(result[:response]["rsp"]["registrationreport"])
  end

  ### Sync Utilities
  ## Assist in keeping scorm cloud, canvas, and local tables in sync

  def sync_registration_score(reg_result)
    reg = Registration.find(reg_result["regid"])
    reg.score = package_score(reg_result["score"])
    if package_complete?(reg_result) && reg.changed?
      response = post_results(registration)
      post_results(response)
    end
  end

  def post_results(reg)
    tp_params = setup_provider_params(reg)
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

  def print_response(response)
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
