class Api::SubmissionsController < Api::ApiApplicationController
  include Concerns::CanvasSupport
  include Concerns::JwtToken
  require 'open-uri'

  before_action :validate_token
  before_action :setup_canvas_api

  def index
    submission = canvas_api.proxy(
      "GET_SINGLE_SUBMISSION_COURSES",
      {
        assignment_id: params[:assignment_id],
        course_id: params[:course_id],
        user_id: params[:user_id],
      }
    )
    attachment = submission["attachments"].find { |h| h["id"] == params[:submission_id].to_i }
    if attachment.nil?
      raise Adhesion::Exceptions::DocviewerGetAttachment
    end

    # This is for sending the binary data back instead
    # @file = open(attachment["url"]).read
    # send_data @file, filename: attachment["display_name"]
    render json: attachment
  end

  def show
    byebug
    submission = canvas_api.proxy("GET_SINGLE_SUBMISSION_COURSES", { assignment_id: 849, course_id: 230, user_id: 434 })
    # submission = canvas_api.proxy("SHOW_USER_DETAILS", { id: params[:id] })
    # submission = canvas_api.proxy("GET_A_SINGLE_SUBMISSION", { course_id: 230, assignment_id: 849, user_id: 434, include: ["user", "submission_comments"] })
  end

  private

  def setup_canvas_api
    @api = canvas_api(
      application_instance: current_application_instance,
      user: current_user,
      course: current_course,
    )
  end

  def submission_params
    params.
      permit(
        course_id,
        assignment_id,
        user_id,
        submission_id,
      )
  end
end
