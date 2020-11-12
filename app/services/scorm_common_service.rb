module ScormCommonService

  require "ajims/lti"

  def sync_courses(courses, lms_course_id)
    if courses
      course_ids = get_course_ids(courses)
      service_id_arel = ScormCourse.arel_table[:scorm_service_id]
      scorm_courses = ScormCourse.
        where(service_id_arel.matches("%_#{lms_course_id.to_i}"))
      existing_complete_course_ids = scorm_courses.
        complete.
        pluck(:scorm_service_id)
      extra = existing_complete_course_ids - course_ids
      remove_extras(extra)
      existing_course_ids = scorm_courses.pluck(:scorm_service_id)
      needed = course_ids - existing_course_ids
      update_scorm_courses(courses, needed)
      get_sync_result(courses)
    end
  end

  def upload_course(file, scorm_course, file_url)
    cleanup = Proc.new { scorm_course.destroy }
    import_job_id = if file_url.present?
                      upload_scorm_course_url(
                        file_url,
                        scorm_course.scorm_service_id,
                        cleanup,
                      )
                    else
                      upload_scorm_course(
                        file,
                        scorm_course.scorm_service_id,
                        cleanup,
                      )
                    end

    {
      scorm_course_id: scorm_course.id,
      import_job_id: import_job_id,
    }
  end

  def remove_course(course_id)
    response = remove_scorm_course(course_id)
    if response[:response] == true
      course = ScormCourse.find_by(scorm_service_id: course_id)
      registrations = Registration.where(lms_course_id: course_id)
      registrations.each do |registration|
        remove_scorm_registration(registration.scorm_registration_id)
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
      result_params[:context_id],
    )
    if registration.nil?
      registration = create_local_registration(result_params, lti_credentials)
      create_scorm_registration(postback_url, result_params, registration, lti_credentials)
    end
    registration
  end

  def create_scorm_registration(postback_url, result_params, registration, lti_credentials)
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

  ### Sync Utilities
  ## Assist in keeping scorm cloud, canvas, and local tables in sync

  def sync_registration(registration_params)
    result = registration_result(
      registration_params[:course_id],
      registration_params[:custom_canvas_user_id],
      registration_params[:context_id],
    )
    if result && result[:response]["rsp"]["stat"] == "fail"
      sync_registration_score(result[:response]["rsp"]["registrationreport"])
    end
  end

  def sync_registration_score(reg_result)
    reg = Registration.find_by(scorm_registration_id: reg_result["regid"] || reg_result["id"])
    activity = reg_result["activity"] || reg_result["activityDetails"]
    lms_user_id = reg_result["learner"]["id"] if reg_result["learner"]
    lms_user_name = construct_name(reg_result)
    user = User.find_by lms_user_id: lms_user_id
    context_id = reg.context_id
    ScormActivity.transaction do
      reg.store_activities(activity.deep_symbolize_keys, nil, 0, lms_user_id, lms_user_name) if activity
    end
    reg.score = package_score(reg_result["score"])
    reg.status = package_complete_status(reg_result)
    should_post_to_lms = (reg.status_changed? || reg.score_changed?) &&
      ["complete", "COMPLETED"].include?(reg.status) &&
      user.student_in_course?(context_id)
    if should_post_to_lms
      response = post_results(reg)
      print_response(reg, response)
    else
      reg.save
    end
  end

  private

  def construct_name(reg_result)
    learner = reg_result["learner"]
    if learner.present?
      "#{learner['lastName']} #{learner['firstName']}"
    end
  end

  def create_local_registration(result_params, lti_credentials)
    registration_params = reg_params(result_params)
    registration = Registration.new(registration_params)
    registration.application_instance = lti_credentials
    registration.save!
    registration
  end

  def remove_extras(extra)
    extra.each do |scorm_service_id|
      ScormCourse.find_by(scorm_service_id: scorm_service_id).destroy
      registrations = Registration.where(lms_course_id: scorm_service_id)
      registrations.each do |reg|
        remove_scorm_registration(reg.id)
        reg.destroy
      end
    end
  end

  def update_scorm_courses(courses, needed)
    new_courses = needed.map do |scorm_service_id|
      ScormCourse.create(scorm_service_id: scorm_service_id)
    end
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
          id: local_course.scorm_service_id,
          importing: local_course.importing?,
        }
        if local_course.lms_assignment_id.nil? == false
          resp[:lms_assignment_id] = local_course.lms_assignment_id
          resp[:points_possible] = local_course.points_possible || 0
          resp[:grading_type] = local_course.grading_type
        end
        resp
      end
    end
  end

  def registration_result(lms_course_id, lms_user_id, context_id)
    registration = find_registration(lms_course_id, lms_user_id, context_id)
    registration_scorm_result(registration.scorm_registration_id) if registration
  end

  def reg_params(params)
    resp = {}
    resp[:lms_course_id] = params[:course_id] unless params[:course_id].nil?
    resp[:lms_user_id] = params[:custom_canvas_user_id] unless params[:custom_canvas_user_id].nil?
    resp[:lis_result_sourcedid] = params[:lis_result_sourcedid] unless params[:lis_result_sourcedid].nil?
    resp[:lis_outcome_service_url] = params[:lis_outcome_service_url] unless params[:lis_outcome_service_url].nil?
    resp[:context_id] = params[:context_id] unless params[:context_id].nil?
    resp
  end

  def find_registration(lms_course_id, lms_user_id, context_id)
    registration = Registration.find_by(
      lms_course_id: lms_course_id,
      lms_user_id: lms_user_id,
      context_id: context_id,
    )

    if registration.nil?
      registration = Registration.find_by(
        lms_course_id: lms_course_id,
        lms_user_id: lms_user_id,
      )

      registration&.update(context_id: context_id)
    end

    registration
  end

  def post_results(reg)
    tp_params = setup_provider_params(reg)
    provider = AJIMS::LTI::ToolProvider.new(
      reg.application_instance.lti_key,
      reg.application_instance.lti_secret,
      tp_params,
    )
    score = reg.scorm_course.grading_type == "pass_fail" ? 1 : reg.score

    provider.post_replace_result!(score)
  end

  def setup_provider_params(reg)
    {
      "lis_outcome_service_url" => reg.lis_outcome_service_url,
      "lis_result_sourcedid" => reg.lis_result_sourcedid,
      "user_id" => reg.lms_user_id,
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
      raise Adhesion::Exceptions::PostResultsToLms.new(response.to_json)
    end
  end

  def package_complete_status(reg_result)
    reg_result["complete"] || reg_result["registrationCompletion"]
  end

  def package_score(score)
    score = score["scaled"] if score.is_a? Hash
    score.to_i / 100.0
  end

end
