class PollCanvasUploadJob < ApplicationJob
  include CanvasSupport

  queue_as :default

  POLL_INTERVAL = 60.seconds

  def perform(
    application_instance,
    current_user,
    lms_course_id,
    scorm_course,
    file_path,
    skip_canvas_upload,
    iteration
  )
    filename = File.basename(file_path)
    current_course = Course.find_by(lms_course_id: lms_course_id)
    @canvas_api = canvas_api(
      application_instance: application_instance,
      user: current_user,
      canvas_course: current_course,
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
          iteration + 1,
        )
    else
      retry_with = "UploadCanvasJob.perform_later(ApplicationInstance.find_by(id: #{application_instance&.id}), User.find_by(id: '#{current_user&.id}'), '#{lms_course_id}', ScormCourse.find_by(id: #{scorm_course&.id}), '#{file_path}', #{skip_canvas_upload})"

      retry_info = {
        user_id: current_user&.id,
        user_email: current_user&.email,
        user_name: current_user&.name,
        lti_user_id: current_user&.lti_user_id,
        lms_user_id: current_user&.lms_user_id,
        timestamp: Time.zone.now.to_s,
        retry_with: retry_with,
      }

      RetryMailer.retry_email("UploadCanvasJob", retry_info.to_json).deliver_later
    end
  end
end
