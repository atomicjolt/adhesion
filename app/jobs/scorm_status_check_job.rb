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
    skip_canvas_upload,
    file_url
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
  rescue Adhesion::Exceptions::ScormImport => e
    message = begin
                JSON.parse(e.message)["message"]
              rescue JSON::ParserError
                e.message
              end

    if message == "Read timed out" && file_url.present?
      # Send to rustici again.
      ScormImportJob.
        perform_later(
          application_instance,
          user,
          lms_course_id,
          scorm_course,
          nil,
          true,
          file_url,
        )
    else
      raise e
    end
  rescue StandardError => e
    message = begin
                JSON.parse(e.message)["message"]
              rescue JSON::ParserError
                e.message
              end

    scorm_course.update(
      import_job_status: ScormCourse::FAILED,
      message: message,
    )
    raise e
  end
end
