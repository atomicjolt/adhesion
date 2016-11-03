class Api::CoursesController < ApplicationController
  include Concerns::CanvasSupport
  include Concerns::JwtToken

  before_action :validate_token

	protect_from_forgery with: :null_session
	before_action :setup

  def course_params
    params.require(:course).permit(:lms_assignment_id, :points_possible)
  end

	def send_scorm_cloud_response(response)
		render json: response, status: response[:status]
	end

	def index
		send_scorm_cloud_response(@scorm_cloud.list_courses)
	end

	def create
		send_scorm_cloud_response(@scorm_cloud.upload_course(params[:filename]))
	end

	def show
		response = @scorm_cloud.course_manifest(params[:id])
    response[:response] = Hash.from_xml(response[:response]) #TODO move parsing to service
		send_scorm_cloud_response(response)
	end

  def update
    course = ScormCourse.find(params[:id])
    course.update_attributes(course_params)
    render json: course
  end

  # def import
  #   result = canvas_api.proxy(
  #     "CREATE_ASSIGNMENT",
  #     {course_id:params[:lms_course_id]},
  #     params[:course]
  #   )
  #   byebug
  #   render json: {}
  #   # save id in scorm course
  # end

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
