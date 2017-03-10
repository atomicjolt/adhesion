module ScormCourseHelper
  def scorm_connect_service
    if current_application_instance.application.scorm_type == "engine"
      ScormEngineService.new
    else
      ScormCloudService.new
    end
  end
end
