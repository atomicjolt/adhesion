require "scorm_cloud"
include ScormCommonService

class ScormCloudService

  def initialize
    @scorm_cloud = ScormCloud::ScormCloud.new(
      Rails.application.secrets.scorm_cloud_app_id,
      Rails.application.secrets.scorm_cloud_secret_key,
    )
  end

  ### Scorm Cloud api wrapper methods
  def launch_course(registration, redirect_url, _postback_url, _result_params = {}, _lti_credentials = {})
    scorm_cloud_request do
      @scorm_cloud.registration.launch(registration.scorm_registration_id, redirect_url)
    end
  end

  def setup_scorm_registration(registration, user, postback_url, lti_key, course_id)
    scorm_cloud_request do
      @scorm_cloud.registration.create_registration(
        course_id,
        registration.scorm_registration_id,
        user[:first_name],
        user[:last_name],
        user[:lms_user_id],
        postbackurl: postback_url,
        authtype: "form",
        urlpass: registration.scorm_cloud_passback_secret,
        urlname: lti_key,
        resultsformat: "full",
      )
    end
  end

  def list_courses(options = {})
    scorm_cloud_request do
      @scorm_cloud.course.get_course_list(options)
    end
  end

  def upload_scorm_course(file, course_id, cleanup)
    scorm_cloud_request(cleanup) do
      response = import_course(file, course_id)
      @scorm_cloud.course.update_attributes(course_id, registrationInstancingOption: "incomplete")
      response
    end
  end

  def update_scorm_course(file, course_id)
    scorm_cloud_request do
      import_course(file, course_id)
    end
  end

  def import_course(file, course_id)
    @scorm_cloud.course.import_course(
      course_id,
      file,
    )
  end

  def show_course(course_id)
    scorm_cloud_request do
      @scorm_cloud.course.get_attributes(course_id)
    end
  end

  def remove_scorm_course(course_id)
    scorm_cloud_request do
      @scorm_cloud.course.delete_course(course_id)
    end
  end

  def remove_scorm_registration(registration_id)
    scorm_cloud_request do
      @scorm_cloud.registration.delete_registration(registration_id)
    end
  end

  def preview_course(course_id, redirect_url)
    scorm_cloud_request do
      @scorm_cloud.course.preview(course_id, redirect_url)
    end
  end

  def course_metadata(course_id)
    scorm_cloud_request do
      @scorm_cloud.course.get_metadata(course_id)
    end
  end

  def course_manifest(course_id)
    scorm_cloud_request do
      resp = @scorm_cloud.course.get_manifest(course_id)
      Hash.from_xml(resp)
    end
  end

  def registration_scorm_result(registration_id)
    scorm_cloud_request do
      resp = @scorm_cloud.registration.get_registration_result(registration_id)
      Hash.from_xml(resp)
    end
  end

  def scorm_cloud_request(handle_fail = nil)
    begin
      return {
        status: 200,
        response: yield,
      }
    rescue ScormCloud::InvalidPackageError => e
      response = { error: e.to_s, status: 400 }
    rescue ScormCloud::RequestError => e
      response = { error: e.to_s, status: 400 }
    rescue ScormCloud::Error => e
      response = { error: e.to_s, status: 400 }
    end
    handle_fail.call if handle_fail.respond_to? :call
    response
  end

  def get_course_ids(courses)
    courses.map(&:id)
  end

  def get_title(courses, course)
    courses.detect { |c| c.id == course.scorm_service_id }.title
  end

  def get_scorm_course(course)
    ScormCourse.find_by(scorm_service_id: course.id)
  end

  def get_course_title(course)
    course.title
  end
end

class ScormConnectError < StandardError
end
