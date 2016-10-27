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

	def launch
		# TODO get real name, and redirect_url
		response = @scorm_cloud.launch_course(
			params[:course_id],
			params[:lms_user_id],
			"fake name",
			lti_launches_url
		)
		send_scorm_cloud_response(response)
	end

	def show
		send_scorm_cloud_response(@scorm_cloud.show_course(params[:id]))
	end

	def destroy
		send_scorm_cloud_response(@scorm_cloud.remove_course(params[:id]))
	end

	def preview
		send_scorm_cloud_response(
			@scorm_cloud.preview_course(params[:course_id], params[:redirect_url]))
	end

	def import
		@canvas_api.proxy("GET_SESSIONLESS_LAUNCH_URL_FOR_EXTERNAL_TOOL_COURSES", {})
		@canvas_api.proxy("CREATE_ASSIGNMENT", {
			assignment: {name: "Test Assignment"}
		});

		render json: {}
	end

	private
		def setup
			@scorm_cloud = ScormCloudService.new
			@canvas_api = Canvas.new(ENV["APP_DEFAULT_CANVAS_URL"], ENV["CANVAS_TOKEN"]);
		end

end
