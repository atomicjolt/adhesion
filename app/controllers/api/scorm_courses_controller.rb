class Api::ScormCoursesController < ApplicationController
  include Concerns::CanvasSupport
  include Concerns::JwtToken
  include ScormCourseHelper

  before_action :validate_token, except: %i[create update]
  before_action :validate_token_shared, only: %i[create update]
  before_action :setup_canvas_api, only: %i[update]

  protect_from_forgery with: :null_session

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
    scorm_course = ScormCourse.create(
      import_job_status: ScormCourse::CREATED,
      lms_course_id: params[:lms_course_id],
    )

    process_scorm_import(scorm_course)
  end

  def show
    response = scorm_connect_service(params[:id]).course_manifest(params[:id])
    send_scorm_connect_response(response)
  end

  def update
    course = ScormCourse.find_by(scorm_service_id: params[:id])

    token = decoded_jwt_token(request)

    config = {
      scorm_course_id: course.id,
      scorm_service_id: course.scorm_service_id,
      lms_course_id: token["lms_course_id"],
    }

    # Add LTI Launch object
    lti_launch = LtiLaunch.create!(
      config: config,
      scorm_course_id: course.id,
      tool_consumer_instance_guid: token["tool_consumer_instance_guid"],
      context_id: token["context_id"],
    )

    domain = current_application_instance.domain
    lti_url = "https://#{domain}/lti_launches/#{lti_launch.token}"

    lms_assignment = create_canvas_assignment(
      package_id: params[:id],
      lti_url: lti_url,
      lms_course_id: token["lms_course_id"],
      name: scorm_course_attrs[:assignment][:name],
      points_possible: scorm_course_attrs[:assignment][:points_possible],
    )

    lms_assignment_id = lms_assignment["id"]
    resource_link_id = lms_assignment["external_tool_tag_attributes"]["resource_link_id"]

    course.lms_assignment_id = lms_assignment_id
    course.resource_link_id = resource_link_id
    course.update(course_params)
    render json: { course: course, lms_assignment: lms_assignment }
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
    scorm_course = ScormCourse.find_by(scorm_service_id: params[:scorm_course_id])
    scorm_course.update(import_job_status: ScormCourse::CREATED)

    process_scorm_import(scorm_course)
  end

  def status
    scorm_course = ScormCourse.find(params[:scorm_course_id])
    render json: { scorm_course_id: scorm_course.id, status: scorm_course.import_job_status }
  end

  private

  def course_params
    params.require(:scorm_course).permit(:lms_assignment_id, :points_possible)
  end

  def scorm_course_attrs
    params.
      require(:scorm_assignment_data).
      permit(
        assignment: [
          :name,
          :points_possible,
        ],
      )
  end

  def setup_canvas_api
    @api = canvas_api(
      application_instance: current_application_instance,
      user: current_user,
      course: current_course,
    )
  end

  def create_canvas_assignment(package_id:, lti_url:, lms_course_id:, name:, points_possible:)
    payload = {
      assignment: {
        name: name,
        submission_types: ["external_tool"],
        integration_id: package_id,
        integration_data: { provider: "atomic-scorm" },
        external_tool_tag_attributes: {
          url: lti_url,
        },
        points_possible: points_possible,
      },
    }

    @api.proxy(
      "CREATE_ASSIGNMENT",
      { course_id: lms_course_id },
      payload,
    )
  end

  def process_scorm_import(scorm_course)
    file_path = copy_to_storage(params[:file], scorm_course.id)

    skip_canvas_upload =
      params[:skip_canvas_upload] == true ||
      params[:skip_canvas_upload] == "true"

    ScormImportJob.
      perform_later(
        current_application_instance,
        current_user,
        params[:lms_course_id],
        scorm_course,
        file_path,
        skip_canvas_upload,
      )
    render json: { scorm_course_id: scorm_course.id }
  end

  def copy_to_storage(file, scorm_course_id)
    storage_mount = Rails.env.production? ? Rails.application.secrets.storage_mount : Dir.tmpdir
    duplicate_dir_path = File.join(storage_mount, "job", scorm_course_id.to_s)
    cmd = "mkdir -p #{duplicate_dir_path}"
    success = system(cmd)
    raise Adhesion::Exceptions::ScormCopyToStorage unless success
    duplicate_file_path = File.join(duplicate_dir_path, file.original_filename)
    cmd = "mv #{file.tempfile.path} #{duplicate_file_path}"
    success = system(cmd)
    raise Adhesion::Exceptions::ScormCopyToStorage unless success
    file.close
    duplicate_file_path
  end

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
end
