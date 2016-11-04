class Api::CoursesController < ApplicationController
  include Concerns::CanvasSupport
  include Concerns::JwtToken

  # before_action :validate_token
  # TODO before action protect canas api

	protect_from_forgery with: :null_session
	before_action :setup

  SCORM_ASSIGNMENT_STATE = {
    GRADED: "GRADED",
    UNGRADED: "UNGRADED"
  }

  def course_params
    params.require(:course).permit(:lms_assignment_id, :points_possible)
  end

	def send_scorm_cloud_response(response)
		render json: response, status: response[:status]
	end

  def courseMeta(scorm_cloud_course)
    scorm_course = ScormCourse.find(scorm_cloud_course.id)
    resp = {
      title: scorm_cloud_course.title,
      id: scorm_cloud_course.id
    }

    if(scorm_course.lms_assignment_id.nil? == false)
      resp[:lms_assignment_id] = scorm_course.lms_assignment_id
      if !scorm_course.points_possible.nil? && scorm_course.points_possible > 0
        resp[:is_graded] = SCORM_ASSIGNMENT_STATE[:GRADED]
      else
        resp[:is_graded] = SCORM_ASSIGNMENT_STATE[:UNGRADED]
      end
    end

    resp
  end

	def index
    result = @scorm_cloud.list_courses
    result[:response].map!{|sc| courseMeta sc}

    send_scorm_cloud_response(result)
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
