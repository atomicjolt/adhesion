class ScormImportJob < ApplicationJob
  include ScormCourseHelper
  queue_as :default

  def perform(
    application_instance,
    user,
    lms_course_id,
    scorm_course,
    file_path,
    skip_canvas_upload,
    file_url = nil
  )
    scorm_course.update(import_job_status: ScormCourse::RUNNING)

    response = scorm_connect_service(lms_course_id, application_instance).
      upload_course(
        file_path,
        scorm_course,
        file_url,
      )

    ScormStatusCheckJob.
      perform_later(
        application_instance,
        user,
        lms_course_id,
        scorm_course,
        file_path,
        response,
        skip_canvas_upload,
        file_url,
      )
  rescue StandardError => e
    scorm_course.update(import_job_status: ScormCourse::FAILED)
    raise e
  end
end
