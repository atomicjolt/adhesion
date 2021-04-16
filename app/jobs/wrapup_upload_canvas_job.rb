class WrapupUploadCanvasJob < ApplicationJob
  include CanvasSupport
  include ScormCourseHelper
  queue_as :default

  discard_on Adhesion::Exceptions::CanvasUploadGatewayTimeout

  def perform(
    application_instance,
    current_user,
    lms_course_id,
    scorm_course,
    file_path
  )
    current_course = Course.find_by(lms_course_id: lms_course_id)
    @canvas_api = canvas_api(
      application_instance: application_instance,
      user: current_user,
      canvas_course: current_course,
    )

    begin
      hide_scorm_file(scorm_course.file_id)
    rescue LMS::Canvas::InvalidAPIRequestFailedException => e
      # ignore it, nobody cares if it is a gateway timeout
      raise e if e.status != 504
    rescue Net::ReadTimeout
      # ignore it, nobody cares
    end

    if scorm_course.lms_assignment_id.present?
      update_canvas_assignment(
        lms_course_id,
        scorm_course.lms_assignment_id,
        scorm_course.title,
      )
    end

    scorm_course.update(
      import_job_status: ScormCourse::COMPLETE,
    )

    FileUtils.remove_entry_secure(file_path) if file_path.present?
  rescue StandardError => e
    scorm_course.update(import_job_status: ScormCourse::FAILED)
    raise e
  end

  def hide_scorm_file(file_id)
    @canvas_api.proxy("UPDATE_FILE", { id: file_id }, { hidden: true })
  end

  def update_canvas_assignment(lms_course_id, assignment_id, name)
    @canvas_api.proxy(
      "EDIT_ASSIGNMENT",
      {
        course_id: lms_course_id,
        id: assignment_id,
      },
      {
        assignment: { name: name },
      },
    )
  end
end
