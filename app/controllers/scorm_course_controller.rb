class ScormCourseController < ApplicationController
  protect_from_forgery with: :null_session
  before_action :setup


  #TODO figure out authentication

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
    puts params[:password]
    puts response

    response = Hash.from_xml(params[:data])
    registration_report = response["registration_report"]
    reg_id = registration_report && registration_report["regid"]
    return json: {}, status: 400 if registration_report.nil? || reg_id.nil?
    validate_postback(reg_id, params[:password])

    @scorm_cloud.sync_registration_score(registration_report)
    render json: {}, status: 200
  end

  def validate_postback(reg_id, password)
    reg = Registration.find(reg_id)
    if reg != password
      render json: {error: "Postback password does not match registration"}, status: :unauthorized
    end
  end

  private
    def setup
      @scorm_cloud = ScormCloudService.new
    end

end
