class Api::ProctoredExamsController < ApplicationController
  before_action :validate_proctor_code

  respond_to :json

  def start_proctored_exam
    examRequest = ExamRequest.find_by(student_id: params[:student_id], status: "started")
    if examRequest.present?
      examRequest.update(status: "in progress")
      render json: examRequest
    else
      render json: { error: "You do not have an exam that is ready to start." }
    end
  end
private
  def validate_proctor_code
    code = ProctorCode.find_by(code: params[:proctor_code])
    render(
      json: { error: "Unauthorized: Invalid Proctor Code." },
      status: :unauthorized,
    ) if code.blank?
  end
end
