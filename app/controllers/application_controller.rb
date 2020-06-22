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

  def render_error(status, message, json_options = {})
    respond_to do |format|
      format.html { render file: "public/#{status}.html", status: status }
      format.json do
        render json: {
          message: message,
        }.merge(json_options), status: status
      end
    end
  end

  def invalid_request(message)
    render_error 400, message
  end

  def user_not_authorized(message = "")
    render_error 401, message
  end

  def record_exception(exception)
    Rails.logger.error "Unexpected exception during execution"
    Rails.logger.error "#{exception.class.name} (#{exception.message}):"
    Rails.logger.error "  #{exception.backtrace.join("\n  ")}"
  end

  # NOTE: Exceptions are specified in order of most general at the top with more specific at the bottom

  rescue_from ActiveRecord::RecordNotFound, with: :not_found
  def not_found
    render_error 404, "Unable to find the requested record"
  end

  rescue_from CanCan::AccessDenied, with: :permission_denied
  def permission_denied(exception = nil)
    message = exception.present? ? exception.message : "Permission denied"
    render_error 403, message
  end

  # Handle other Canvas related exceptions
  rescue_from LMS::Canvas::CanvasException, with: :handle_canvas_exception
  def handle_canvas_exception(exception)
    record_exception(exception)
    render_error 500, "Error while accessing Canvas: #{exception.message}.", { exception: exception }
  end

  # Raised when a new token cannot be retrieved using the refresh token
  rescue_from LMS::Canvas::RefreshTokenFailedException, with: :handle_canvas_token_expired

  # Raised if a refresh token or its options are not available
  rescue_from LMS::Canvas::RefreshTokenRequired, with: :handle_canvas_token_expired
  def handle_canvas_token_expired(exception)
    # Auth has gone bad. Remove it and request that the user do OAuth
    user = nil
    if auth = Authentication.find_by(id: exception.auth&.id)
      user = auth.user
      auth.destroy
    end
    json_options = {}
    if current_application_instance.oauth_precedence.include?("user") || # The application allows for user tokens
        current_user == user # User owns the authentication. We can ask them to refresh
      json_options = {
        canvas_authorization_required: true,
      }
    end
    render_error 401, "Canvas API Token has expired.", json_options
  end

  # Raised when no Canvas token is available
  rescue_from Exceptions::CanvasApiTokenRequired, with: :handle_canvas_token_required
  def handle_canvas_token_required(exception)
    json_options = {
      exception: exception,
      canvas_authorization_required: true,
    }
    render_error 401, "Unable to find valid Canvas API Token.", json_options
  end

  rescue_from LMS::Canvas::InvalidAPIRequestFailedException, with: :handle_invalid_canvas_api_request
  def handle_invalid_canvas_api_request(exception)
    json_options = {
      exception: exception,
      backtrace: exception.backtrace,
    }
    render_error 500, "An error occured when calling the Canvas API: #{exception.message}", json_options
  end

  rescue_from StandardError, with: :error unless Rails.application.config.consider_all_requests_local

  def error(e)
    @exception = e.message
    @exception_name = e.class.name
    @backtrace = e.backtrace
    @status = ActionDispatch::ExceptionWrapper.new(request.env, e).status_code

    if send_error_email_for(e.class)
      ErrorMailer.error_email(current_user, error_info.to_json).deliver_later
    end

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

  def ignore_exception_level_filters
    [
      ActionController::RoutingError,
    ]
  end

  def send_error_email_for(error_class)
    ignore_exception_level_filters.exclude?(error_class)
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
