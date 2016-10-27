class Api::CoursesController < ApplicationController
	protect_from_forgery with: :null_session
	before_action :setup
	# before_action :validate_token # TODO: make sure to add account back in for security

    def registration_params
        permitted = params.permit(:course_id, :user_id)
        return {
            lms_course_id: permitted[:course_id],
            # lms_user_id: current_user.id
            lms_user_id: 1
        }
    end

	def index
		response = @scorm_cloud.list_courses
    render json: {response: response}, status: response[:status]
	end

	def create
		response = @scorm_cloud.upload_course(params[:filename])
		render json: {response: response}, status: response[:status]
	end

	def launch
		response = @scorm_cloud.launch_course(
			params[:course_id],
			params[:lms_user_id],
			"fake name",
			lti_launches_url
		)
		render json: {response: response}, status: response[:status]
	end

	def show
		response = @scorm_cloud.show_course(params[:id])
		render json: {response: response}, status: response[:status]
	end

	def destroy
		response = @scorm_cloud.remove_course(params[:id])
		render json: {response: response}, status: response[:status]
	end

	def preview
		response = @scorm_cloud.preview_course(params[:course_id], params[:redirect_url])
		render json: {response: response}, status: response[:status]
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
