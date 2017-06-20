class Api::ProctoredExamsController < ApplicationController
  before_action :validate_proctor_code, only: [:start_proctored_exam]
  skip_before_action :validate_token
  skip_before_action :protect_from_forgery
  include Concerns::CanvasSupport

  respond_to :json

  def start_proctored_exam
    if params[:update]
      finish_proctored_exam
      return
    end
    quiz_params = {
      id: @exam_request.exam_id,
      course_id: @exam_request.course_id,
    }
    quiz = canvas_api.proxy("GET_SINGLE_QUIZ", quiz_params)

    render json: { quiz: @exam_request, proctor_access_code: quiz.parsed_response["access_code"] }
  end

  def finish_proctored_exam
    @exam_request.update(status: "finished")
    render json: { status: "ok" }
  end

  private

  def validate_proctor_code
    @exam_request = ExamRequest.find_by(student_id: params[:student_id], status: "started")
    if params[:update]
      return
    end
    if !@exam_request
      render json: { error: "You do not have an exam that is ready to start." }
      return
    end

    account_params = {
      account_id: @exam_request[:testing_center_id],
    }
    users = canvas_api.proxy("LIST_USERS_IN_ACCOUNT", account_params)

    matched_code = false
    users.parsed_response.each do |user|
      begin
        custom_data_params = {
          ns: "edu.au.exam",
          scope: "/exam/proctor_code",
          user_id: user["id"],
        }
        proctor_code = canvas_api.proxy("LOAD_CUSTOM_DATA", custom_data_params).parsed_response["data"]
        puts "********************************"
        puts proctor_code
        puts "********************************"
        if proctor_code == params[:proctor_code]
          @exam_request.update_attributes(unlocked_by_id: user["id"], unlocked_by_name: user["name"])
          matched_code = true
        end
      rescue LMS::Canvas::InvalidAPIRequestFailedException
        # this probably means that the user doesnt have a proctor code... unfortunately canvas doesn't
        # actually tell us why it returned 401 just that it did
      end
    end

    if !matched_code
      render(
        json: { error: "Unauthorized: Invalid Proctor Code." },
        status: :unauthorized,
      )
    end
  end
end
