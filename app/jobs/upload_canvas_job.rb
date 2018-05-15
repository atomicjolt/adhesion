class UploadCanvasJob < ApplicationJob
  include Concerns::CanvasSupport
  include ScormCourseHelper
  queue_as :default

  SCORM_DIR = "scorm_files".freeze
  CANVAS_ROOT_DIR = "course files".freeze

  def perform(
    application_instance,
    current_user,
    lms_course_id,
    scorm_course,
    file_path,
    skip_canvas_upload
  )
    scorm_course.update(import_job_status: ScormCourse::RUNNING)

    current_course = Course.find_by(lms_course_id: lms_course_id)
    @canvas_api = canvas_api(
      application_instance: application_instance,
      user: current_user,
      course: current_course,
    )

    if skip_canvas_upload
      scorm_course.update(
        import_job_status: ScormCourse::COMPLETE,
      )
    else
      process_canvas_file(scorm_course, file_path, lms_course_id)
    end

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

  def process_canvas_file(scorm_course, file_path, lms_course_id)
    delete_canvas_file(scorm_course.file_id) if scorm_course&.file_id
    file_id =
      if file_path.present?
        folder = get_folder(lms_course_id)
        if folder.nil?
          folder = create_folder(lms_course_id)
        end
        if folder["locked"] != true
          update_folder(folder)
        end
        upload_canvas_file(file_path, lms_course_id, folder)
      end

    if file_id
      hide_scorm_file(file_id)
      scorm_course.update(
        file_id: file_id,
        import_job_status: ScormCourse::COMPLETE,
      )
    else
      raise Adhesion::Exceptions::ScormCanvasUpload.new
    end
  end

  def get_folder(lms_course_id)
    folders = @canvas_api.proxy(
      "RESOLVE_PATH_COURSES_FULL_PATH",
      {
        course_id: lms_course_id,
        path: SCORM_DIR,
      },
    ).parsed_response

    folders.detect do |folder|
      folder["full_name"] == "#{CANVAS_ROOT_DIR}/#{SCORM_DIR}"
    end
  rescue LMS::Canvas::InvalidAPIRequestFailedException => e
    raise e unless e.to_s.include?("Status: 404 Not Found")
  end

  def update_folder(folder)
    @canvas_api.proxy(
      "UPDATE_FOLDER",
      {
        id: folder["id"],
      },
      {
        locked: true,
      },
    ).parsed_response
  end

  def create_folder(lms_course_id)
    @canvas_api.proxy(
      "CREATE_FOLDER_COURSES",
      {
        course_id: lms_course_id,
      },
      {
        name: SCORM_DIR,
        parent_folder_path: CANVAS_ROOT_DIR,
        locked: true,
      },
    ).parsed_response
  end

  def upload_canvas_file(file_path, lms_course_id, folder)
    canvas_response = @canvas_api.proxy(
      "COURSES_UPLOAD_FILE",
      {
        course_id: lms_course_id,
      },
      {
        name: File.basename(file_path),
        content_type: "application/zip",
        parent_folder_id: folder["id"],
        on_duplicate: "rename",
        locked: true,
      },
    ).parsed_response
    canvas_response["upload_params"]["file"] =
      UploadIO.new(File.new(file_path), "application/zip", File.basename(file_path))

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

  def hide_scorm_file(file_id)
    @canvas_api.proxy("UPDATE_FILE", { id: file_id }, { locked: true })
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
