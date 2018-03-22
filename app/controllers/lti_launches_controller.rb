class LtiLaunchesController < ApplicationController
  include Concerns::CanvasSupport
  include Concerns::LtiSupport
  include ScormCourseHelper

  layout "client"

  skip_before_action :verify_authenticity_token
  before_action :do_lti, except: [:launch]
  before_action :setup, only: %i[show]

  def index
    if current_application_instance.disabled_at
      render file: File.join(Rails.root, "public", "disabled.html")
    end
    setup_lti_response
  end

  def show
    @lti_launch = LtiLaunch.find_by(token: params[:id], context_id: params[:context_id])
    if @lti_launch[:config][:scorm_service_id].present?
      launch_scorm_course(@lti_launch[:config][:scorm_service_id])
      return
    end
    setup_lti_response
    render :index
  end

  def launch
    @launch_params = Lti::Launch.params(
      current_application_instance.lti_key,
      current_application_instance.lti_secret,
      {
        "launch_url" => lti_launches_url,
        "roles" => "Learner",
      },
    )
  end

  private

  def setup
    if current_application_instance.application.client_application_name == "scorm"
      @scorm_connect = scorm_connect_service(params[:custom_canvas_course_id])
    end
  end

  def setup_lti_response
    begin
      @canvas_proctor_url = Rails.application.secrets.canvas_proctor_url
      @canvas_api = canvas_api
      @canvas_auth_required = @canvas_api.blank?
    rescue CanvasApiTokenRequired
      @canvas_auth_required = true
    end
    set_lti_launch_values
  end

end
