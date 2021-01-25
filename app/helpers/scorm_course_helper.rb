module ScormCourseHelper
  def scorm_connect_service(lms_course_id, app_instance = current_application_instance)
    @service ||= if app_instance.scorm_type == "engine"
                   ScormEngineService.new(lms_course_id)
                 else
                   ScormCloudService.new
                 end
  end

  def launch_scorm_course(scorm_service_id = nil)
    if params[:course_id].nil?
      params[:course_id] = scorm_service_id
    end
    registration = @scorm_connect.get_registration(
      scorm_courses_postback_url,
      params,
      current_application_instance,
    )
    launch = @scorm_connect.launch_course(
      registration,
      params[:launch_presentation_return_url],
      scorm_courses_postback_url,
      params,
      current_application_instance,
    )

    @scorm_connect.sync_registration(params)
    if launch[:status] == 200
      redirect_to launch[:response]
    else
      render template: "errors/unauthorized", layout: "errors", status: :unauthorized
    end
  end
end
