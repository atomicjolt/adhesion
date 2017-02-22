class Api::ScormCoursesController < ApplicationController
  include Concerns::CanvasSupport
  include Concerns::JwtToken

  before_action :validate_token

  protect_from_forgery with: :null_session

  def course_params
    params.require(:scorm_course).permit(:lms_assignment_id, :points_possible)
  end

  def send_scorm_cloud_response(response)
    render json: response, status: response[:status]
  end

  def index
    courses = scorm_cloud_service.list_courses(
      filter: ".*_#{params[:lms_course_id]}",
    )
    courses[:response] = scorm_cloud_service.sync_courses(courses[:response])
    send_scorm_cloud_response(courses)
  end

  def create
    response = scorm_cloud_service.upload_course(
      params[:file],
      params[:lms_course_id],
    )
    file_id = upload_canvas_file(params[:file], params[:lms_course_id])
    ScormCourse.find(response[:response]["course_id"]).update_attribute(:file_id, file_id)
    send_scorm_cloud_response(response)
  end

  def show
    response = scorm_cloud_service.course_manifest(params[:id])
    send_scorm_cloud_response(response)
  end

  def update
    course = ScormCourse.find_by(scorm_cloud_id: params[:id])
    course.update_attributes(course_params)
    render json: course
  end

  def destroy
    course = ScormCourse.find_by(scorm_cloud_id: params[:id])
    response = scorm_cloud_service.remove_course(params[:id])
    delete_canvas_file(course.file_id) if course&.file_id
    send_scorm_cloud_response(response)
  end

  def preview
    send_scorm_cloud_response(
      scorm_cloud_service.preview_course(
        params[:scorm_course_id],
        params[:redirect_url],
      ),
    )
  end

  private

  def delete_canvas_file(file_id)
    canvas_api.proxy("DELETE_FILE", { id: file_id })
  end

  def upload_canvas_file(file, lms_course_id)
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
    response = RestClient.post canvas_response["upload_url"],
                               canvas_response["upload_params"]
    JSON.parse(response)["id"]
  end

  def scorm_cloud_service
    ScormCloudService.new
  end
end
