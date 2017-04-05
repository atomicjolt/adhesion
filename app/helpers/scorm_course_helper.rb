module ScormCourseHelper
  def scorm_connect_service(lms_course_id)
    @service ||= if current_application_instance.scorm_type == "engine"
                   ScormEngineService.new(lms_course_id)
                 else
                   ScormCloudService.new
                 end
  end
end
