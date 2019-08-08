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
  rescue Adhesion::Exceptions::ScormImport, StandardError => e
    handle_error(
      e,
      application_instance,
      user,
      lms_course_id,
      scorm_course,
      file_url,
    )
  end

  def handle_error(
    err,
    application_instance,
    user,
    lms_course_id,
    scorm_course,
    file_url
  )
    message = begin
                JSON.parse(err.message)["message"]
              rescue JSON::ParserError
                err.message
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
      if message != "RUNNING"
        scorm_course.update(
          import_job_status: ScormCourse::FAILED,
          message: message,
        )
      end
      raise err
    end
  end
end
