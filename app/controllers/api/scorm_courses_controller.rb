class Api::ScormCoursesController < ApplicationController
  include Concerns::CanvasSupport
  include Concerns::JwtToken
  include ScormCourseHelper

  before_action :validate_token

  protect_from_forgery with: :null_session

  def course_params
    params.require(:scorm_course).permit(:lms_assignment_id, :points_possible)
  end

  def send_scorm_connect_response(response)
    render json: response, status: response[:status]
  end

  def index
    courses = scorm_connect_service.list_courses(
      filter: ".*_#{params[:lms_course_id]}",
    )
    if courses[:status] != 400
      courses[:response] = scorm_connect_service.sync_courses(courses[:response])
    end
    send_scorm_connect_response(courses)
  end

  def create
    response = scorm_connect_service.upload_course(
      params[:file],
      params[:lms_course_id],
    )
    if response[:error].present?
      render json: response[:error], status: response[:status]
      return
    end
    file_id = upload_canvas_file(params[:file], params[:lms_course_id])
    if file_id
      ScormCourse.find(
        response["course_id"],
      ).update_attribute(:file_id, file_id)
    end
    send_scorm_connect_response(response)
  end

  def show
    response = scorm_connect_service.course_manifest(params[:id])
    send_scorm_connect_response(response)
  end

  def update
    course = ScormCourse.find_by(scorm_cloud_id: params[:id])
    course.update_attributes(course_params)
    render json: course
  end

  def destroy
    course = ScormCourse.find_by(scorm_cloud_id: params[:id])
    response = scorm_connect_service.remove_course(params[:id])
    delete_canvas_file(course.file_id) if course&.file_id
    course.update_attribute(:file_id, nil)
    send_scorm_connect_response(response)
  end

  def preview
    send_scorm_connect_response(
      scorm_connect_service.preview_course(
        params[:scorm_course_id],
        params[:redirect_url],
      ),
    )
  end

  def replace
    course = ScormCourse.find_by(scorm_cloud_id: params[:scorm_course_id])
    response = scorm_connect_service.update_course(
      params[:file],
      course,
    )
    delete_canvas_file(course.file_id) if course&.file_id
    file_id = upload_canvas_file(params[:file], params[:lms_course_id])
    course.update_attribute(:file_id, file_id) if file_id
    if course.lms_assignment_id
      update_canvas_assignment(
        params[:lms_course_id],
        course.lms_assignment_id,
        response[:response][:title],
      )
    end
    send_scorm_connect_response(response)
  end

  private

  def delete_canvas_file(file_id)
    canvas_api.proxy("DELETE_FILE", { id: file_id })
  end

  def upload_canvas_file(file, lms_course_id)
    if file.is_a? ActionDispatch::Http::UploadedFile
      canvas_response = canvas_api.proxy(
        "COURSES_UPLOAD_FILE",
        {
          course_id: lms_course_id,
        },
        {
          name: file.original_filename,
          content_type: "application/zip",
          parent_folder_path: "scorm_files/",
          on_duplicate: "rename",
        },
      ).parsed_response
      canvas_response["upload_params"]["file"] = File.new(file.tempfile)
      RestClient.post(
        canvas_response["upload_url"],
        canvas_response["upload_params"],
      ) do |response|
        case response.code
        when 200
          JSON.parse(response.body)["id"]
        when 302
          # When redirected, the body has a link to the file similar to:
          # canvas.com/api/v1/files/573347/create_success
          body = response.body
          scanner = StringScanner.new body
          scanner.scan_until(/api\/.+\/files\//)
          # scanner will now be at
          # 573347/create_success
          id = scanner.scan_until(/\//)
          # id will be 573347/
          # now remove the / and return 573347
          id[0...-1]
        end
      end
    end
  end

  def update_canvas_assignment(lms_course_id, assignment_id, name)
    canvas_api.proxy(
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
