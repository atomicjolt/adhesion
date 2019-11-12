class ApplicationController < ActionController::Base

  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  before_action :configure_permitted_parameters, if: :devise_controller?

  helper_method :current_application_instance,
                :current_bundle_instance,
                :current_course,
                :canvas_url,
                :targeted_app_instance,
                :current_user_roles

  def routing_error
    raise ActionController::RoutingError.new(params[:path])
  end

  protected

  rescue_from StandardError, with: :error unless Rails.application.config.consider_all_requests_local

  def error(e)
    @exception = e.message
    @exception_name = e.class.name
    @backtrace = e.backtrace
    @status = ActionDispatch::ExceptionWrapper.new(request.env, e).status_code

    ErrorMailer.error_email(current_user, error_info.to_json).deliver_later

    respond_to do |format|
      format.html { render_html_error }
      format.json { render_json_error }
      format.all { render nothing: true, status: status }
    end
  end

  def render_html_error
    if @status == 404
      render template: "errors/not_found", layout: "errors", status: @status
    elsif @status == 401
      render template: "errors/unauthorized", layout: "errors", status: @status
    elsif @status == 422
      render template: "errors/unprocessable", layout: "errors", status: @status
    else
      render template: "errors/internal_server_error", layout: "errors", status: @status
    end
  end

  def render_json_error
    render json: error_info.to_json, status: @status
  end

  def error_info
    params_dup = request.params.dup
    params_dup["authenticity_token"] = "******"
    if params_dup["user"].present?
      params_dup["user"]["password"] = "******"
    end
    if params_dup["file"].present?
      params_dup["file"] = params_dup["file"].headers
    end

    {
      user_id: current_user&.id,
      user_email: current_user&.email,
      user_name: current_user&.name,
      lti_user_id: current_user&.lti_user_id,
      lms_user_id: current_user&.lms_user_id,
      timestamp: Time.zone.now.to_s,
      url: request.url,
      request_method: request.request_method,
      params: params_dup,
      headers: {
        "Accept-Language": request.headers["Accept-Language"],
        "Accept-Encoding": request.headers["Accept-Encoding"],
        "Accept": request.headers["Accept"],
        "User-Agent": request.headers["User-Agent"],
        "Host": request.headers["host"],
        "Version": request.headers["version"],
        "Referer": request.headers["Referer"],
        "If-None-Match": request.headers["If-None-Match"],
      },
      error: @status.to_s,
      exception: "#{@exception_name} : #{@exception}",
      backtrace: @backtrace,
    }
  end

  # **********************************************
  # Paging methods
  #
  def setup_will_paginate
    @page = (params[:page] || 1).to_i
    @page = 1 if @page < 1
    @per_page = (params[:per_page] || (Rails.env.test? ? 1 : 40)).to_i
  end

  def canvas_url
    @canvas_url ||= session[:canvas_url] ||
      custom_canvas_api_domain ||
      current_application_instance&.site&.url ||
      current_bundle_instance&.site&.url
  end

  def custom_canvas_api_domain
    if params[:custom_canvas_api_domain].present?
      "https://#{params[:custom_canvas_api_domain]}"
    end
  end

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
    devise_parameter_sanitizer.permit(:account_update, keys: [:name])
  end

  def current_application_instance
    @current_application_instance ||=
      LtiAdvantage::Authorization.application_instance_from_token(request.params["id_token"]) ||
      ApplicationInstance.find_by(lti_key: Lti::Request.oauth_consumer_key(request)) ||
      ApplicationInstance.find_by(domain: request.host_with_port) ||
      ApplicationInstance.find_by(id: params[:application_instance_id])
  end

  def current_course
    lms_course_id = params[:custom_canvas_course_id] || params[:lms_course_id]
    @course ||= Course.find_by(lms_course_id: lms_course_id)
  end

  def current_application
    Application.find_by(key: request.subdomains.first)
  end

  def current_bundle_instance
    @current_bundle ||= BundleInstance.
      where(id_token: params[:bundle_instance_token]).
      or(BundleInstance.where(id: params[:bundle_instance_id])).
      first
  end

  def current_ability
    @current_ability ||= Ability.new(current_user, params[:context_id])
  end

  def current_user_roles(context_id: nil)
    current_user.nil_or_context_roles(context_id).map(&:name)
  end

  def user_not_authorized(message = "")
    respond_to do |format|
      format.html { render template: "errors/unauthorized", layout: "errors", status: :unauthorized }
      format.json { render json: { message: message }, status: :unauthorized }
    end
  end

  def set_lti_launch_values
    @is_lti_launch = true
    @app_name = current_application_instance.application.client_application_name
  end

  def targeted_app_instance
    key = request.subdomains.first
    application = Application.find_by(key: key)
    return nil if current_bundle_instance.nil?
    current_bundle_instance.
      application_instances.
      find_by(application_id: application.id)
  end

end
