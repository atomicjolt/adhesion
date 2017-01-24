class Api::AssignedExamsController < ApplicationController
  include Concerns::CanvasSupport
  include Concerns::JwtToken
  before_action :validate_token

  respond_to :json

  def index
    assigned_exams = AssignedExam.where(student_id: params[:student_id])
    render json: assigned_exams
  end

  def create
    assigned_exam = AssignedExam.create!(create_params)
    create_proctor_codes(assigned_exam)
    render json: assigned_exam
  end

  def update
    assigned_exam = AssignedExam.find(params[:id])
    assigned_exam.update(testing_center_id: params[:testing_center_id])
    create_proctor_codes(assigned_exam)
    render json: assigned_exam
  end

  def destroy
    assigned_exam = AssignedExam.find(params[:id])
    assigned_exam.destroy
    # return what was destroyed so
    # we can take it out of reducer
    render json: assigned_exam
  end

  private

  def create_params
    params.require(:assigned_exam).permit(
      :exam_id, :course_id, :testing_center_name,
      :student_id, :testing_center_id, :exam_name, 
      :student_name, :course_name, :message
    )
  end

  def create_proctor_codes(assigned_exam)
    assigned_exam.proctor_codes.destroy_all

    canvas_params = {
      account_id: assigned_exam.testing_center_id
    }
    proctors = canvas_api.proxy("LIST_USERS_IN_ACCOUNT", canvas_params, "")

    proctors.each do |proctor|
      attrs = {
        proctor_id: proctor["id"],
        code: SecureRandom.hex(5)
      }
      assigned_exam.proctor_codes.create!(attrs)
    end
  end
end
