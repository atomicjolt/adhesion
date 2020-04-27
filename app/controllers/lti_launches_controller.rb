class LtiLaunchesController < ApplicationController
  include Concerns::CanvasSupport
  include Concerns::LtiSupport
  include Concerns::OpenIdConnectSupport
  include ScormCourseHelper

  layout "client"

  skip_before_action :verify_authenticity_token
  before_action :validate_user_is_admin_for_user_tool, except: [:init, :launch]
  before_action :do_lti, except: [:init, :launch]
  before_action :setup, only: %i[show]

  def index
    if current_application_instance.disabled_at
      render file: File.join(Rails.root, "public", "disabled.html")
    end

    # LTI advantage example code
    if @lti_token
      @lti_advantage_examples = LtiAdvantage::Examples.new(@lti_token, current_application_instance)
      @lti_advantage_examples.run
    end

    setup_lti_response
  end

  def show
    @lti_launch = LtiLaunch.find_by(token: params[:id], context_id: params[:context_id])

    # TODO This code is temporary and is meant to update existing records with the correct
    # context id. We'll want to remove this after it's been in production long enough
    # for user data to get updated
    if @lti_launch.blank?
      @lti_launch = LtiLaunch.find_by(token: params[:id])
      if @lti_launch.context_id.blank?
        @lti_launch.update!(context_id: params[:context_id])
      end
    end
    # TODO END

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

  # Support Open ID connect flow for LTI 1.3
  def init
    nonce = SecureRandom.hex(64)
    url = build_response(LtiAdvantage::OpenId.state, params, nonce)
    respond_to do |format|
      format.html { redirect_to url }
    end
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
    rescue Exceptions::CanvasApiTokenRequired
      @canvas_auth_required = true
    end
    set_lti_launch_values
  end

end
