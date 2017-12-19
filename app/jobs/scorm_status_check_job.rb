class ScormStatusCheckJob < ApplicationJob
  include ScormCourseHelper
  queue_as :default

  def perform(
    application_instance,
    user,
    lms_course_id,
    scorm_course,
    file_path,
    response,
    skip_canvas_upload
  )
    scorm_course.update(import_job_status: ScormCourse::RUNNING)

    scorm_service = scorm_connect_service(lms_course_id, application_instance)
    status = scorm_service.check_import_progress(response[:import_job_id])

    raise Adhesion::Exceptions::ScormImport.new(status) if status != "COMPLETE"

    title = scorm_service.get_scorm_title(scorm_course.scorm_service_id)
    scorm_course.update(title: title)

    UploadCanvasJob.
      perform_later(
        application_instance,
        user,
        lms_course_id,
        scorm_course,
        file_path,
        skip_canvas_upload,
      )
  rescue StandardError => e
    scorm_course.update(import_job_status: ScormCourse::FAILED)
    raise e
  end
end
