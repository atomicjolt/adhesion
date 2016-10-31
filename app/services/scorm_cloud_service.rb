require "scorm_cloud"

class ScormCloudService

  def initialize
    @scorm_cloud = ScormCloud::ScormCloud.new(ENV["SCORM_CLOUD_APP_ID"], ENV["SCORM_CLOUD_SECRET_KEY"])
  end

  def split_name(name)
      parts = name.split(" ")
      [parts.shift, parts.join(' ')]
  end


  def launch_course(scorm_course_id:, lms_user_id:, first_name:, last_name:, redirect_url:, postback_url:)
    scorm_cloud_request do
      registration_params = {
        lms_course_id: scorm_course_id,
        lms_user_id: lms_user_id
      }
  		registration = Registration.where(registration_params).first
  		if registration.nil?
  			registration = Registration.create registration_params
  			response = @scorm_cloud.registration.create_registration(
          registration_params[:lms_course_id],
          registration.id,
          first_name,
          last_name,
          registration_params[:lms_user_id],
          {
            authtype: "httpbasic",
            postbackurl: postback_url
          }
        )
  		end
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
