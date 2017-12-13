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

    response = scorm_connect_service(lms_course_id, application_instance).
      upload_course(
        file_path,
        filename,
        scorm_course,
      )

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
  rescue StandardError => e
    scorm_course.update(import_job_status: ScormCourse::FAILED)
    raise e
  end
end
