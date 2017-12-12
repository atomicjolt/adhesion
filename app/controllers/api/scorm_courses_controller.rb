class Api::ScormCoursesController < ApplicationController
  include Concerns::CanvasSupport
  include Concerns::JwtToken
  include ScormCourseHelper

  before_action :validate_token, except: %i[create update]
  before_action :validate_token_shared, only: %i[create update]

  protect_from_forgery with: :null_session

  def course_params
    params.require(:scorm_course).permit(:lms_assignment_id, :points_possible)
  end

  def send_scorm_connect_response(response)
    render json: response, status: response[:status]
  end

  def index
    courses = scorm_connect_service(params[:lms_course_id]).list_courses(
      filter: ".*_#{params[:lms_course_id]}",
    )
    if courses[:status] != 400
      courses[:response] = scorm_connect_service(params[:lms_course_id]).sync_courses(
        courses[:response],
        params[:lms_course_id],
      )
    end
    send_scorm_connect_response(courses)
  end

  def create
    scorm_course = ScormCourse.create(import_job_status: ScormCourse::CREATED)
    ScormImportJob.
      perform_later(
        current_application_instance,
        current_user,
        params[:lms_course_id],
        scorm_course,
        params[:file].tempfile.to_path,
        params[:file].original_filename,
      )
    render json: { scorm_course_id: scorm_course.id }
  end

  def show
    response = scorm_connect_service(params[:id]).course_manifest(params[:id])
    send_scorm_connect_response(response)
  end

  def update
    course = ScormCourse.find_by(scorm_service_id: params[:id])
    course.update_attributes(course_params)
    render json: course
  end

  def destroy
    course = ScormCourse.find_by(scorm_service_id: params[:id])
    course_id = get_course_id(params[:id])
    response = scorm_connect_service(course_id).remove_course(params[:id])
    delete_canvas_file(course.file_id) if course&.file_id
    course.update_attribute(:file_id, nil)
    send_scorm_connect_response(response)
  end

  def preview
    course_id = get_course_id(params[:scorm_course_id])
    send_scorm_connect_response(
      scorm_connect_service(course_id).preview_course(
        params[:scorm_course_id],
        params[:redirect_url],
      ),
    )
  end

  def course_report
    scorm_course = ScormCourse.find_by(
      scorm_service_id: params[:scorm_course_id],
    )
    render json: scorm_course.course_analytics
  end

  def activity_report
    scorm_course = ScormCourse.find_by(
      scorm_service_id: params[:scorm_course_id],
    )
    render json: scorm_course.course_activities
  end

  def replace
    course = ScormCourse.find_by(scorm_service_id: params[:scorm_course_id])
    course_id = get_course_id(params[:scorm_course_id])
    response = scorm_connect_service(course_id).update_course(
      params[:file],
      course,
    )
    delete_canvas_file(course.file_id) if course&.file_id
    file_id = upload_canvas_file(params[:file], params[:lms_course_id])
    if file_id
      course.update_attribute(:file_id, file_id)
      hide_scorm_file(file_id)
    end
    if course.lms_assignment_id
      update_canvas_assignment(
        params[:lms_course_id],
        course.lms_assignment_id,
        response[:response][:title],
      )
    end
    send_scorm_connect_response(response)
  end

  def status
    scorm_course = ScormCourse.find(params[:scorm_course_id])
    render json: { scorm_course_id: scorm_course.id, status: scorm_course.import_job_status }
  end

  private

  def validate_token_shared
    if params[:shared_auth].present?
      aud = Rails.application.secrets.auth0_client_id
      secret = Rails.application.secrets.shared_auth_secret
      validate_token_with_secret(aud, secret)
    else
      validate_token
    end
  end

  def get_course_id(id)
    id.split("_")[1] || id
  end

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
        when 302, 303
          file_confirm = RestClient.get(response.headers[:location])
          JSON.parse(file_confirm.body)["id"]
        end
      end
    end
  end

  def hide_scorm_file(file_id)
    canvas_api.proxy("UPDATE_FILE", { id: file_id }, { hidden: true })
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
