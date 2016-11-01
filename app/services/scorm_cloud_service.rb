require "scorm_cloud"

class ScormCloudService

  def initialize
    @scorm_cloud = ScormCloud::ScormCloud.new(ENV["SCORM_CLOUD_APP_ID"], ENV["SCORM_CLOUD_SECRET_KEY"])
  end

  def split_name(name)
      parts = name.split(" ")
      [parts.shift, parts.join(' ')]
  end

  def find_registration(lms_course_id,lms_user_id)
    registration_params = {
        lms_course_id: lms_course_id,
        lms_user_id: lms_user_id
      }
		Registration.where(registration_params).first
  end

  def sync_registration(params)
    reg = Registration.where(reg_params(params)).first
    result = registration_result(reg.lms_course_id, reg.lms_user_id) unless reg.nil?
    byebug
  end

  def reg_params(params)
    {
      lms_course_id: params[:course_id],
      lms_user_id: params[:custom_canvas_user_id],
      lis_result_sourcedid: params[:lis_result_sourcedid],
      lis_outcome_service_url: params[:lis_outcome_service_url]
    }
  end

  def launch_course(
    scorm_course_id:,
    lms_user_id:,
    first_name:,
    last_name:,
    redirect_url:,
    postback_url:,
    lti_credentials: {},
    result_params: {}
    )
    scorm_cloud_request do
      registration_params = {
        lms_course_id: scorm_course_id,
        lms_user_id: lms_user_id
      }
      registration = find_registration(scorm_course_id, lms_user_id)
      if registration.nil?
  			registration = Registration.create reg_params(result_params)
  			response = @scorm_cloud.registration.create_registration(
          registration_params[:lms_course_id],
          registration.id,
          first_name,
          last_name,
          registration_params[:lms_user_id],
          {
            postbackurl: postback_url
          }
        )
  		end

      # a = Registration.new(reg_params(result_params))
      # tp_params = {
      #   'lis_outcome_service_url' =>  a[:lis_outcome_service_url],
      #   'lis_result_sourcedid' => a[:lis_result_sourcedid],
      #   'user_id' => a[:lms_user_id]
      # }
      # @tp = IMS::LTI::ToolProvider.new(
      #   lti_credentials.lti_key,
      #   lti_credentials.lti_secret,
      #   tp_params)

      # byebug
      registration.sync

      @scorm_cloud.registration.launch(registration.id, redirect_url)
    end
  end

  def list_courses
    scorm_cloud_request do
      @scorm_cloud.course.get_course_list
    end
  end

  def upload_course(file)
    course = ScormCourse.create
    cleanup = Proc.new { course.destroy }
    scorm_cloud_request(cleanup) do
      response = @scorm_cloud.course.import_course(course.id, file)
    end
  end

  def show_course(course_id)
    scorm_cloud_request do
	    @scorm_cloud.course.get_attributes(course_id)
    end
  end

  def remove_course(course_id)
    scorm_cloud_request do
      response = @scorm_cloud.course.delete_course(course_id)
      if response == true
    		course = ScormCourse.find(course_id)
        course.destroy unless course.nil?
      end
      response
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
      @scorm_cloud.course.get_manifest(course_id)
    end
  end

  def registration_result(lms_course_id, lms_user_id)
    scorm_cloud_request do
      reg = find_registration(lms_course_id, lms_user_id)
      resp = @scorm_cloud.registration.get_registration_result(reg.id) unless reg.nil?
      Hash.from_xml(resp)
    end
  end

  def scorm_cloud_request(handle_fail = nil)
    begin
      return {
        status: 200,
        response: yield
      }
    rescue ScormCloud::InvalidPackageError => e
      response = {error: e.to_s, status: 400}
    rescue ScormCloud::RequestError => e
      response = {error: e.to_s, status:400}
    rescue ScormCloud::Error => e
      response = {error: e.to_s, status: 400}
    end
    handle_fail.call if handle_fail.respond_to? :call
    return response
  end
end
