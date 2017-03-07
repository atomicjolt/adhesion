class Api::ProctoredExamsController < ApplicationController
  before_action :validate_proctor_code
  include Concerns::CanvasSupport

  respond_to :json

  def start_proctored_exam
    render json: @exam_request
  end

  private

  def validate_proctor_code
    @exam_request = ExamRequest.find_by(student_id: params[:student_id], status: "started")
    puts "======================================================"
    puts @exam_request.present?

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
