require "scorm_cloud"

class ScormCloudService

  def initialize
    @scorm_cloud = ScormCloud::ScormCloud.new(ENV["SCORM_CLOUD_APP_ID"], ENV["SCORM_CLOUD_SECRET_KEY"])
  end

  def list_courses
    scorm_cloud_request do
      return @scorm_cloud.course.get_course_list
    end
  end

  def upload_course(file)
    course = ScormCourse.create
    cleanup = Proc.new { course.destroy }
    scorm_cloud_request(cleanup) do
      response = @scorm_cloud.course.import_course(course.id, file)
    end
  end

	def scorm_cloud_request(handle_fail = nil)
		begin
      response = {status: 200}
      response[:response] = yield
			return response
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
