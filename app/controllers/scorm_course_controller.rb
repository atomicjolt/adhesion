class ScormCourseController < ApplicationController
  include Concerns::LtiSupport

  protect_from_forgery with: :null_session
  before_action :setup
  before_action :validate_postback_credentials, only: [:postback]
  before_action :do_lti

  def create
    launch = @scorm_cloud.launch_course(
      scorm_course_id: params[:course_id],
      lms_user_id: params[:custom_canvas_user_id],
      first_name: params[:lis_person_name_given],
      last_name: params[:lis_person_name_family],
      redirect_url: params[:launch_presentation_return_url],
      postback_url: scorm_course_postback_url,
      lti_credentials: current_lti_application,
      result_params: params
    )

    @scorm_cloud.sync_registration(params)

    if launch[:status] == 200
      redirect_to launch[:response]
    else
      render file: "public/401.html", status: :unauthorized
    end
  end

  def postback
    response = Hash.from_xml(params[:data])
    @scorm_cloud.sync_registration_score(response["registrationreport"])
    render json: {}, status: 200
  end

  def validate_postback_credentials
    response = Hash.from_xml(params[:data])
    registration_report = response["registrationreport"]
    reg_id = registration_report && registration_report["regid"]

    begin
      reg = Registration.find(reg_id)
      raise ScormCloudError.new if(reg.scorm_cloud_passback_secret != params[:password])
    rescue ScormCloudError, ActiveRecord::RecordNotFound => e
      render json: {error: 'Not Authorized'}, status: 400
    end
  end

  private
    def setup
      @scorm_cloud = ScormCloudService.new
    end

end
