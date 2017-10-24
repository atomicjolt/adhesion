class ApplicationController < ActionController::Base

  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  before_action :configure_permitted_parameters, if: :devise_controller?

  helper_method :current_application_instance,
                :current_bundle_instance,
                :current_course,
                :canvas_url,
                :targeted_app_instance

  def routing_error
    raise ActionController::RoutingError.new(params[:path])
  end

  protected

  rescue_from CanCan::AccessDenied do |exception|
    respond_to do |format|
      format.html { redirect_to root_url, alert: exception.message }
      format.json { render json: { error: exception.message }, status: :unauthorized }
    end
  end

  rescue_from StandardError, with: :error unless Rails.application.config.consider_all_requests_local

  def error(e)
    @exception = e.message
    @backtrace = e.backtrace
    status = ActionDispatch::ExceptionWrapper.new(request.env, e).status_code
    respond_to do |format|
      format.html { render_html_error(status) }
      format.json { render_json_error(status) }
      format.all { render nothing: true, status: 404 }
    end
  end

  def render_html_error(status)
    if status == 404
      render template: "errors/not_found", layout: "errors", status: status
    elsif status == 401
      render template: "errors/unauthorized", layout: "errors", status: status
    elsif status == 422
      render template: "errors/unprocessable", layout: "errors", status: status
    else
      render template: "errors/internal_server_error", layout: "errors", status: status
    end
  end

  def render_json_error(status)
    if [401, 404, 422].include?(status)
      error_info = {
        error: status.to_s,
        exception: "#{e.class.name} : #{@exception}",
      }
      render json: error_info.to_json, status: status
    else
      error_info = {
        error: "internal-server-error",
        exception: "#{e.class.name} : #{@exception}",
        backtrace: @backtrace,
      }
      render json: error_info.to_json, status: 500
    end
  end

  def canvas_url
    @canvas_url ||= session[:canvas_url] ||
      current_application_instance&.site&.url ||
      current_bundle_instance&.site&.url
  end

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
    devise_parameter_sanitizer.permit(:account_update, keys: [:name])
  end

  def current_application_instance
    @current_application_instance ||=
      ApplicationInstance.find_by(lti_key: params[:oauth_consumer_key]) ||
      ApplicationInstance.find_by(domain: request.host_with_port) ||
      ApplicationInstance.find_by(id: params[:application_instance_id])
  end

  def current_course
    @course ||=
      Course.
        where(lms_course_id: params[:custom_canvas_course_id]).
        or(Course.where(lms_course_id: params[:lms_course_id])).
        first
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

  def user_not_authorized
    respond_to do |format|
      format.html { render file: "public/401.html", status: :unauthorized }
      format.json { render json: {}, status: :unauthorized }
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
