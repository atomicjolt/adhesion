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

  def upload_course
    scorm_cloud_request do
      course = ScormCourse.create
      response = scorm_cloud.course.import_course(course.id, params[:filename])
    end
  end

	def scorm_cloud_request
		begin
			return yield
		rescue ScormCloud::InvalidPackageError => e
		  return {error: e.to_json()}
		rescue ScormCloud::RequestError => e
			return {error: e.to_json()}
		rescue ScormCloud::Error => e
			return {error: e.to_json}
		end
	end
end
