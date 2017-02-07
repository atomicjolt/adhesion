class Api::ProctorLoginController < ApplicationController
  include Concerns::JwtToken
  before_action :validate_token

  respond_to :jsons

  def signed_url
    exam_request = ExamRequest.find(params[:id])
    verifier = ActiveSupport::MessageVerifier.new(Rails.application.secrets.proctor_login_secret)
    date = Time.now.to_i
    signature = verifier.generate(
      "user_id=#{exam_request.student_id}&course_id=#{exam_request.course_id}&quiz_id=#{exam_request.exam_id}&date=#{date}"
    )
    url = "#{Rails.application.secrets.canvas_proctor_url}/proctor_login?user_id=#{exam_request.student_id}&course_id=#{exam_request.course_id}&quiz_id=#{exam_request.exam_id}&date=#{date}&signature=#{signature}"
    render json: {signed_url: url}
  end
end
