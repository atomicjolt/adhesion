class Api::AssignedExamsController < ApplicationController
  include Concerns::JwtToken
  before_action :validate_token

  respond_to :json

  def index
    assigned_exams = AssignedExam.where(exam_id: params[:exam_id])
    render json: assigned_exams
  end

  def create
    assigned_exam = AssignedExam.create!(create_params)
    render json: assigned_exam
  end

  def update
  end

  private

  def create_params
    params.require(:assigned_exam).permit(
      :exam_id, :course_id, :student_id, :instructor_id, :testing_center_id
    )
  end
end
