class Api::ProctoredExamsController < ApplicationController
  before_action :validate_proctor_code

  respond_to :json

  def start_proctored_exam
    exam_request = ExamRequest.find_by(student_id: params[:student_id], status: "started")
    if exam_request.present?
      exam_request.update(status: "in progress")
      render json: exam_request
    else
      render json: { error: "You do not have an exam that is ready to start." }
    end
  end

  private

  def validate_proctor_code
    code = ProctorCode.find_by(code: params[:proctor_code])
    if code.blank?
      render(
        json: { error: "Unauthorized: Invalid Proctor Code." },
        status: :unauthorized,
      )
    end
  end
end
