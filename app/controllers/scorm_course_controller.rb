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
      postback_url: "http://43a89bba.ngrok.io/scorm_course/postback",
      # scorm_course_postback_url,
      lti_credentials: current_lti_application,
      result_params: params
    )

    @scorm_cloud.sync_registration(params, current_lti_application)

    if launch[:status] == 200
      redirect_to launch[:response]
    else
      render file: "public/401.html", status: :unauthorized
    end
  end

  def index
    render file: "public/scorm_return.html", :layout => false
  end

  def postback
    response = Hash.from_xml(params[:data])
    @scorm_cloud.update_sync(response["registrationreport"], current_lti_application)
    render json: {}, status: 200
  end

  private
    def setup
      @scorm_cloud = ScormCloudService.new
    end

end
