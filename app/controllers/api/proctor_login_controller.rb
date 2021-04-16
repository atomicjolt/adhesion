class Api::ProctorLoginController < ApplicationController
  include JwtToken
  before_action :validate_token

  respond_to :jsons

  def signed_url
    exam_request = ExamRequest.find(params[:id])
    exam_request.update_attributes(unlocked_by_id: current_user.lms_user_id, unlocked_by_name: current_user.name)
    verifier = ActiveSupport::MessageVerifier.new(Rails.application.secrets.proctor_login_secret)
    date = Time.now.to_i
    params = {
      user_id: exam_request.student_id,
      course_id: exam_request.course_id,
      quiz_id: exam_request.exam_id,
      date: date,
    }.to_query
    signature = verifier.generate(params)
    url = "#{Rails.application.secrets.canvas_proctor_url}/proctor_login?#{params}&signature=#{signature}"
    render json: { signed_url: url }
  end
end
