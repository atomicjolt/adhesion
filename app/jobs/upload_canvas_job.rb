class UploadCanvasJob < ApplicationJob
  include Concerns::CanvasSupport
  include ScormCourseHelper
  queue_as :default

  def perform(
    application_instance,
    current_user,
    lms_course_id,
    scorm_course,
    file_path
  )
    scorm_course.update(import_job_status: ScormCourse::RUNNING)

    current_course = Course.find_by(lms_course_id: lms_course_id)
    @canvas_api = canvas_api(
      application_instance: application_instance,
      user: current_user,
      course: current_course,
    )

    delete_canvas_file(scorm_course.file_id) if scorm_course&.file_id
    file_id = upload_canvas_file(file_path, lms_course_id)
    if file_id
      hide_scorm_file(file_id)
      scorm_course.update(
        file_id: file_id,
        import_job_status: ScormCourse::COMPLETE,
      )
    else
      raise Adhesion::Exceptions::ScormCanvasUpload.new
    end

    if scorm_course.lms_assignment_id.present?
      update_canvas_assignment(
        lms_course_id,
        scorm_course.lms_assignment_id,
        scorm_course.title,
      )
    end

    FileUtils.remove_entry_secure(file_path)
  rescue StandardError => e
    scorm_course.update(import_job_status: ScormCourse::FAILED)
    raise e
  end

  def upload_canvas_file(file_path, lms_course_id)
    if file_path.present?
      canvas_response = @canvas_api.proxy(
        "COURSES_UPLOAD_FILE",
        {
          course_id: lms_course_id,
        },
        {
          name: File.basename(file_path),
          content_type: "application/zip",
          parent_folder_path: "scorm_files/",
          on_duplicate: "rename",
        },
      ).parsed_response
      canvas_response["upload_params"]["file"] = File.new(file_path)
      RestClient.post(
        canvas_response["upload_url"],
        canvas_response["upload_params"],
      ) do |response|
        case response.code
        when 200
          JSON.parse(response.body)["id"]
        when 302, 303
          file_confirm = RestClient.get(response.headers[:location])
          JSON.parse(file_confirm.body)["id"]
        end
      end
    end
  end

  def hide_scorm_file(file_id)
    @canvas_api.proxy("UPDATE_FILE", { id: file_id }, { hidden: true })
  end

  def delete_canvas_file(file_id)
    @canvas_api.proxy("DELETE_FILE", { id: file_id })
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
