class ScormCoursesController < ApplicationController
  include LtiSupport
  include ScormCourseHelper

  protect_from_forgery with: :null_session
  skip_before_action :verify_authenticity_token, only: [:postback]

  before_action :setup, except: [:postback]
  before_action :setup_postback, only: [:postback]
  before_action :validate_postback_credentials, only: [:postback]
  before_action :do_lti, only: [:create]

  def create
    launch_scorm_course
  end

  def postback
    @scorm_connect.sync_registration_score(@data)
    render json: {}, status: 200
  end

  private

  def validate_postback_credentials
    reg = Registration.find_by(scorm_registration_id: @reg_id)
    if reg.scorm_cloud_passback_secret != params[:password]
      raise ScormConnectError.new
    end
  rescue ScormConnectError, ActiveRecord::RecordNotFound
    render json: { error: "Not Authorized" }, status: 400
  end

  def setup
    @scorm_connect = scorm_connect_service(params[:custom_canvas_course_id])
  end

  def setup_postback
    if current_application_instance.scorm_type == "engine"
      response = JSON.parse(params[:data])
      @reg_id = response["id"]
      course_id = response["course"]["id"].split("_").second
      @data = response
    else
      response = Hash.from_xml(params[:data])
      registration_report = response["registrationreport"]
      @reg_id = registration_report && registration_report["regid"]
      course_id = params[:custom_canvas_course_id]
      @data = response["registrationreport"]
    end
    @scorm_connect = scorm_connect_service(course_id)
  end
end
