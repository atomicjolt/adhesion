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
      scorm_course.update(file_id: course_file["id"])
      skip_canvas_upload = true
    end

    if iteration < 30 && course_file.nil?
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
end
