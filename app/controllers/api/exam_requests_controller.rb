class Api::ExamRequestsController < ApplicationController
  include Concerns::CanvasSupport
  include Concerns::JwtToken
  before_action :validate_token

  respond_to :json

  def index
    if params[:student_id].present?
      exam_requests = ExamRequest.where(student_id: params[:student_id])
    elsif params[:testing_center_id].present?
      exam_requests = ExamRequest.where(testing_center_id: params[:testing_center_id])
    end
    render json: exam_requests
  end

  def create
    exam_request = ExamRequest.create!(create_params)
    render json: exam_request
  end

  def update
    exam_request = ExamRequest.find(params[:id])
    exam_request.update(update_params)
    render json: exam_request
  end

  def destroy
    exam_request = ExamRequest.find(params[:id])
    exam_request.destroy
    # return what was destroyed so
    # we can take it out of reducer
    render json: exam_request
  end

  private

  def create_params
    params.require(:exam_request).permit(
      :exam_id, :course_id, :testing_center_name,
      :student_id, :testing_center_id, :exam_name,
      :student_name, :course_name, :message
    )
  end

  def update_params
    params.require(:exam_request).permit(
      :scheduled_date, :scheduled_time, :status
    )
  end

end
