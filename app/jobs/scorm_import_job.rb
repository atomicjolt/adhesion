class ScormImportJob < ApplicationJob
  include ScormCourseHelper
  queue_as :default

  def perform(
    application_instance,
    user,
    lms_course_id,
    scorm_course,
    file_path,
    filename
  )
    scorm_course.update(import_job_status: ScormCourse::RUNNING)

    scorm_file = File.open(file_path)
    response = scorm_connect_service(lms_course_id, application_instance).
      upload_course(
        scorm_file,
        filename,
        lms_course_id,
        scorm_course,
      )
    scorm_file.close

    ScormStatusCheckJob.
      perform_later(
        application_instance,
        user,
        lms_course_id,
        scorm_course,
        file_path,
        filename,
        response,
      )
  end
end
