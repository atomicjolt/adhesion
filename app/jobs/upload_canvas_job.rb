class UploadCanvasJob < ApplicationJob
  include Concerns::CanvasSupport
  include ScormCourseHelper
  queue_as :default

  discard_on Adhesion::Exceptions::CanvasUploadGatewayTimeout

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

    if !skip_canvas_upload
      process_canvas_file(
        application_instance,
        current_user,
        lms_course_id,
        scorm_course,
        file_path,
        skip_canvas_upload,
      )
    end

    WrapupUploadCanvasJob.
      perform_later(
        application_instance,
        current_user,
        lms_course_id,
        scorm_course,
        file_path,
      )
  rescue StandardError => e
    scorm_course.update(import_job_status: ScormCourse::FAILED)
    raise e
  end

  def process_canvas_file(
    application_instance,
    current_user,
    lms_course_id,
    scorm_course,
    file_path,
    skip_canvas_upload
  )
    delete_canvas_file(scorm_course.file_id) if scorm_course&.file_id
    file_id = upload_canvas_file(
      application_instance,
      current_user,
      lms_course_id,
      scorm_course,
      file_path,
      skip_canvas_upload,
    )
    if file_id
      scorm_course.update(file_id: file_id)
    else
      raise Adhesion::Exceptions::ScormCanvasUpload.new
    end
  end

  def upload_canvas_file(
    application_instance,
    current_user,
    lms_course_id,
    scorm_course,
    file_path,
    skip_canvas_upload
  )
    if file_path.present?
      filename = File.basename(file_path)
      canvas_response = @canvas_api.proxy(
        "COURSES_UPLOAD_FILE",
        {
          course_id: lms_course_id,
        },
        {
          name: filename,
          content_type: "application/zip",
          parent_folder_path: "scorm_files/",
          on_duplicate: "overwrite",
        },
      ).parsed_response
      canvas_response["upload_params"]["file"] = File.new(file_path)

      begin
        RestClient.post(
          canvas_response["upload_url"],
          canvas_response["upload_params"],
        ) do |response|
          case response.code
          when 200, 201
            JSON.parse(response.body)["id"]
          when 302, 303
            file_confirm = RestClient.get(response.headers[:location])
            JSON.parse(file_confirm.body)["id"]
          end
        end
      rescue RestClient::GatewayTimeout
        PollCanvasUploadJob.
          perform_later(
            application_instance,
            current_user,
            lms_course_id,
            scorm_course,
            file_path,
            skip_canvas_upload,
            filename,
            0,
          )
        raise Adhesion::Exceptions::CanvasUploadGatewayTimeout.new
      end
    end
  end

  def delete_canvas_file(file_id)
    @canvas_api.proxy("DELETE_FILE", { id: file_id })
  end
end
