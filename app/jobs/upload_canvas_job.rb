class UploadCanvasJob < ApplicationJob
  include CanvasSupport
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
        lms_course_id,
        scorm_course,
        file_path,
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
  rescue Adhesion::Exceptions::CanvasUploadGatewayTimeout
    PollCanvasUploadJob.
      perform_later(
        application_instance,
        current_user,
        lms_course_id,
        scorm_course,
        file_path,
        skip_canvas_upload,
        0,
      )
    # Raising this exception here lets this job be dismissed.
    raise
  rescue StandardError => e
    scorm_course.update(import_job_status: ScormCourse::FAILED)
    raise e
  end

  def process_canvas_file(
    lms_course_id,
    scorm_course,
    file_path
  )
    begin
      delete_canvas_file(scorm_course.file_id) if scorm_course&.file_id
    rescue LMS::Canvas::InvalidAPIRequestFailedException => e
      # ignore it, nobody cares if it is a gateway timeout
      raise e if e.status != 504
    rescue Net::ReadTimeout
      # ignore it, nobody cares
    end
    file_id = upload_canvas_file(
      lms_course_id,
      file_path,
    )
    if file_id
      scorm_course.update(file_id: file_id)
    else
      raise Adhesion::Exceptions::ScormCanvasUpload.new
    end
  end

  def upload_canvas_file(
    lms_course_id,
    file_path
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
          when 504
            raise Adhesion::Exceptions::CanvasUploadGatewayTimeout.new
          when 200, 201
            JSON.parse(response.body)["id"]
          when 302, 303
            RestClient.get(response.headers[:location]) do |get_response|
              if get_response.code == 504
                raise Adhesion::Exceptions::CanvasUploadGatewayTimeout.new
              else
                JSON.parse(get_response.body)["id"]
              end
            end
          end
        end
      rescue RestClient::GatewayTimeout
        raise Adhesion::Exceptions::CanvasUploadGatewayTimeout.new
      end
    end
  end

  def delete_canvas_file(file_id)
    @canvas_api.proxy("DELETE_FILE", { id: file_id })
  end
end
