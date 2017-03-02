require "httparty"
include "ScormCommonService"

class ScormEngineService

  def initialize(tenant = "default")
    api_interface = Rails.application.secrets.scorm_api_url
    @scorm_tenant_url = Rails.application.secrets.scorm_domain + api_interface + tenant
    @options = {
      headers: {
        "Content-Type" => "application/json",
      },
      basic_auth: {
        username: Rails.application.secrets.scorm_api_username,
        password: Rails.application.secrets.scorm_api_password,
      },
    }
  end

  def sync_courses(courses)

  end

  def launch_course(registration, redirect_url)
    options[:query] = { redirectOnExitUrl: redirect_url }
    options = merge_options(options)
    launch_link = get_launch_link(registration.id)["launchLink"]
    HTTParty.get(Rails.application.secrets.scorm_domain + launch_link, options)
  end

  def setup_engine_registration(registration, user, postback_url, _lti_credentials)
    options = merge_options(options)
    options[:query] = {
      registrationId: registration.id,
      courseId: registration.lms_course_id,
      learner: {
        id: user[:lms_user_id],
        firstName: user[:last_name],
        lastName: user[:first_name],
      },
      postBack: {
        url: postback_url,
      },
    }
    HTTParty.post(@scorm_tenant_url + "/registrations", options)
  end

  def list_courses(options = {})
    options = merge_options(options)
    HTTParty.get(@scorm_tenant_url + "/courses", options)
  end

  def upload_engine_course(file, package_id, _cleanup)
    options = merge_options({})
    options[:headers] = { "Content-Type": "multipart/form-data" }
    options[:query] = { url: file }
    HTTParty.post(@scorm_tenant_url + "/courses/importJobs?course=#{package_id}", options)
  end

  def show_course(course_id)
    HTTParty.get(@scorm_tenant_url + "/courses/#{course_id}", @options)
  end

  def remove_engine_course(course_id)
    HTTParty.delete(@scorm_tenant_url + "/courses/#{course_id}", @options)
  end

  def remove_engine_registration(registration_id)
    HTTParty.delete(@scorm_tenant_url + "/registrations/#{registration_id}", @options)
  end

  def preview_course(course_id, redirect_url)
    options[:query] = { redirectOnExitUrl: redirect_url }
    options = merge_options(options)
    HTTParty.get(@scorm_tenant_url + "/courses/#{course_id}", options)
  end

  def course_metadata(course_id)
    # not sure there is a metadata call currently
    HTTParty.get(@scorm_tenant_url + "/courses/#{course_id}", @options)
  end

  def course_manifest(course_id)
    # not sure there is a metadata call currently
    HTTParty.get(@scorm_tenant_url + "/courses/#{course_id}", @options)
  end

  def registration_engine_result(registration_id)
    HTTParty.get(@scorm_tenant_url + "/registrations/#{registration_id}/progress/detail", @options)
  end

  private

  def get_launch_link(registration_id)
    HTTParty.get(@scorm_tenant_url + "/registrations/#{registration_id}/launchLink")
  end

  def merge_options(options)
    options.merge(@options)
  end

end
