class LtiLaunchesController < ApplicationController
  include CanvasSupport
  include LtiSupport
  include OpenIdConnectSupport
  include ScormCourseHelper

  layout "client"

  skip_before_action :verify_authenticity_token
  before_action :validate_user_is_admin_for_user_tool, except: [:init, :launch]
  before_action :do_lti, except: [:init, :launch]
  before_action :setup, only: %i[show]
  before_action :debug_data, except: [:init, :launch]

  def index
    if current_application_instance.disabled_at
      render file: File.join(Rails.root, "public", "disabled.html")
    end

    if @lti_token
      # LTI advantage example code
      @lti_advantage_examples = LtiAdvantage::Examples.new(@lti_token, current_application_instance)
      @lti_advantage_examples.run

      if params[:lti_launch_token].present?
        @lti_launch = LtiLaunch.find_by(
          token: params[:lti_launch_token],
          context_id: @lti_token[LtiAdvantage::Definitions::CONTEXT_CLAIM]["id"],
        )

        set_lti_launch_resource_link_id
      end
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
    set_lti_launch_resource_link_id
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
    state = LtiAdvantage::OpenId.state
    url = build_response(state, params, nonce)
    cookies[:open_id_state] = state
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

  def debug_data
    @debug_data = {
      "Tenant Name" => Apartment::Tenant.current,
      "LTI Advantage" => !!@lti_token,
      "App Name" => current_application&.name,
      "Client App" => current_application&.client_application_name,
      "LTI Key" => current_application_instance&.lti_key,
      "Domain" => current_application_instance&.domain,
    }
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

  def set_lti_launch_resource_link_id
    return unless @lti_launch
    return if @lti_launch.resource_link_id.present?

    if @lti_token && @lti_token[LtiAdvantage::Definitions::RESOURCE_LINK_CLAIM].present?
      @lti_launch.update(resource_link_id: @lti_token[LtiAdvantage::Definitions::RESOURCE_LINK_CLAIM]["id"])
    elsif params[:resource_link_id].present?
      @lti_launch.update(resource_link_id: params[:resource_link_id])
    end
  end
end
