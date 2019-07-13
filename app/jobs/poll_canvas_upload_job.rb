class PollCanvasUploadJob < ApplicationJob
  include Concerns::CanvasSupport

  queue_as :default

  POLL_INTERVAL = 60.seconds

  def perform(
    application_instance,
    current_user,
    lms_course_id,
    scorm_course,
    file_path,
    skip_canvas_upload,
    filename,
    iteration
  )
    current_course = Course.find_by(lms_course_id: lms_course_id)
    @canvas_api = canvas_api(
      application_instance: application_instance,
      user: current_user,
      course: current_course,
    )

    course_files = @canvas_api.proxy(
      "LIST_FILES_COURSES",
      {
        course_id: lms_course_id,
        search_term: filename,
      },
      {},
      true,
    )

    course_file = course_files.detect { |cf| cf["display_name"] == filename }
    if course_file.present?
      hide_scorm_file(course_file["id"])
      scorm_course.update(file_id: course_file["id"])
      WrapupUploadCanvasJob.
        perform_later(
          application_instance,
          current_user,
          lms_course_id,
          scorm_course,
          file_path,
        )
    elsif iteration < 30
      PollCanvasUploadJob.
        set(wait: POLL_INTERVAL).
        perform_later(
          application_instance,
          current_user,
          lms_course_id,
          scorm_course,
          file_path,
          skip_canvas_upload,
          filename,
          iteration + 1,
        )
    else
      UploadCanvasJob.
        perform_later(
          application_instance,
          current_user,
          lms_course_id,
          scorm_course,
          file_path,
          skip_canvas_upload,
        )
    end
  end

  def hide_scorm_file(file_id)
    @canvas_api.proxy("UPDATE_FILE", { id: file_id }, { hidden: true })
  end
end
