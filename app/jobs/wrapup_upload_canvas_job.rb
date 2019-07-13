class WrapupUploadCanvasJob < ApplicationJob
  include Concerns::CanvasSupport
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
      course: current_course,
    )

    scorm_course.update(
      import_job_status: ScormCourse::COMPLETE,
    )

    if scorm_course.lms_assignment_id.present?
      update_canvas_assignment(
        lms_course_id,
        scorm_course.lms_assignment_id,
        scorm_course.title,
      )
    end

    FileUtils.remove_entry_secure(file_path) if file_path.present?
  rescue StandardError => e
    scorm_course.update(import_job_status: ScormCourse::FAILED)
    raise e
  end
end
