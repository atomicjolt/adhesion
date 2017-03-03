require 'net/http'
include ScormCommonService

class ScormEngineService

  def initialize(tenant = "default")
    api_interface = Rails.application.secrets.scorm_api_url
    @scorm_tenant_url = Rails.application.secrets.scorm_domain + api_interface + tenant
    @api_username = Rails.application.secrets.scorm_api_username
    @api_password = Rails.application.secrets.scorm_api_password
  end

  def launch_course(registration, redirect_url)
    launch_link = get_launch_link(registration.id)["launchLink"]
    uri = URI(Rails.application.secrets.scorm_domain + launch_link)
    Net::HTTP.start(uri.host, uri.port) do |http|
      request = Net::HTTP::Get.new(uri, 'Content-Type' => 'application/json')
      request.basic_auth @api_username, @api_password
      request.body = { redirectOnExitUrl: redirect_url }.to_json
      response = http.request request
      response[:status] = response.code
      response
    end
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
    Net::HTTP.post(@scorm_tenant_url + "/registrations", options)
  end

  def list_courses(options = {})
    courses = {}
    uri = URI(@scorm_tenant_url + "/courses")
    Net::HTTP.start(uri.host, uri.port) do |http|
      request = Net::HTTP::Get.new(uri, 'Content-Type' => 'application/json')
      request.basic_auth @api_username, @api_password
      response = http.request request
      courses[:response] = (JSON.parse response.body)["courses"]
      courses[:status] = response.code
    end
    courses
  end

  def upload_engine_course(file, package_id, _cleanup)
    uri = URI(@scorm_tenant_url + "/courses/importJobs?course=#{package_id}")
    Net::HTTP.start(uri.host, uri.port) do |http|
      request = Net::HTTP::Post.new(uri, 'Content-Type' => 'application/json')
      request.basic_auth @api_username, @api_password
      request.body = { url: file }
      request.content_type = "multipart/form-data"
      response = http.request request
      response[:status] = response.code
      response
    end
  end

  def show_course(course_id)
    Net::HTTP.get(@scorm_tenant_url + "/courses/#{course_id}", @options)
  end

  def remove_engine_course(course_id)
    Net::HTTP.delete(@scorm_tenant_url + "/courses/#{course_id}", @options)
  end

  def remove_engine_registration(registration_id)
    Net::HTTP.delete(@scorm_tenant_url + "/registrations/#{registration_id}", @options)
  end

  def preview_course(course_id, redirect_url)
    uri = URI(@scorm_tenant_url + "/courses/#{course_id}/preview")
    Net::HTTP.start(uri.host, uri.port) do |http|
      request = Net::HTTP::Get.new(uri, 'Content-Type' => 'application/json')
      request.basic_auth @api_username, @api_password
      request.body = { redirectOnExitUrl: redirect_url } if redirect_url
      response = http.request request
      response[:status] = response.code
      response
    end
  end

  def course_metadata(course_id)
    # not sure there is a metadata call currently
    Net::HTTP.get(@scorm_tenant_url + "/courses/#{course_id}", @options)
  end

  def course_manifest(course_id)
    # not sure there is a metadata call currently
    Net::HTTP.get(@scorm_tenant_url + "/courses/#{course_id}", @options)
  end

  def registration_engine_result(registration_id)
    Net::HTTP.get(@scorm_tenant_url + "/registrations/#{registration_id}/progress/detail", @options)
  end

  private

  def get_launch_link(registration_id)
    Net::HTTP.get(@scorm_tenant_url + "/registrations/#{registration_id}/launchLink")
  end

  def merge_options(options)
    options.merge(@options)
  end

end
