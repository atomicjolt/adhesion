class Api::CoursesController < ApplicationController
	protect_from_forgery with: :null_session
	before_action :setup
	# before_action :validate_token # TODO: make sure to add account back in for security

	def send_scorm_cloud_response(response)
		render json: response, status: response[:status]
	end

	def index
		send_scorm_cloud_response(@scorm_cloud.list_courses)
	end

	def create
		send_scorm_cloud_response(@scorm_cloud.upload_course(params[:filename]))
	end

	# def launch
	# 	response = @scorm_cloud.launch_course(
	# 		params[:course_id],
	# 		params[:lms_user_id],
	# 		current_user.name,
	# 		lti_launches_url
	# 	)
	# 	send_scorm_cloud_response(response)
	# end

	def show
		response = @scorm_cloud.course_manifest(params[:id])
    response[:response] = Hash.from_xml(response[:response])
		send_scorm_cloud_response(response)
	end

	def destroy
		send_scorm_cloud_response(@scorm_cloud.remove_course(params[:id]))
	end

	def preview
		send_scorm_cloud_response(
			@scorm_cloud.preview_course(params[:course_id], params[:redirect_url]))
	end

  private
    def setup
      @scorm_cloud = ScormCloudService.new
    end
end
