class ScormCoursesController < ApplicationController
  include Concerns::LtiSupport
  include ScormCourseHelper

  protect_from_forgery with: :null_session
  before_action :setup
  before_action :validate_postback_credentials, only: [:postback]
  before_action :do_lti, only: [:create]

  def create
    registration = @scorm_connect.get_registration(
      scorm_courses_postback_url,
      params,
      current_application_instance,
    )
    launch = @scorm_connect.launch_course(
      registration,
      params[:launch_presentation_return_url],
    )

    @scorm_connect.sync_registration(params)
    if launch[:status] == 200
      redirect_to launch[:response]
    else
      render file: "public/401.html", status: :unauthorized
    end
  end

  def postback
    response = Hash.from_xml(params[:data])
    @scorm_connect.sync_registration_score(response["registrationreport"])
    render json: {}, status: 200
  end

  private

  def validate_postback_credentials
    response = Hash.from_xml(params[:data])
    registration_report = response["registrationreport"]
    reg_id = registration_report && registration_report["regid"]
    begin
      reg = Registration.find_by(scorm_registration_id: reg_id)
      if reg.scorm_cloud_passback_secret != params[:password]
        raise ScormConnectError.new
      end
    rescue ScormConnectError, ActiveRecord::RecordNotFound
      render json: { error: "Not Authorized" }, status: 400
    end
  end

  def setup
    @scorm_connect = scorm_connect_service(params[:custom_canvas_course_id])
  end
end
