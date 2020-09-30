require "rails_helper"

RSpec.describe Api::ProctorLoginController, type: :controller do
  before do
    setup_users
    request.headers["Authorization"] = @user_token
  end

  describe "GET #signed_url" do
    it "returns a signed url" do
      student = create(:user)
      exam_request = create(:exam_request, student_id: student.id)
      get :signed_url, params: { id: exam_request.id }
      expect(response).to be_success

      body = JSON.parse(response.body)
      expect(body).to be_present

      signed_url = body["signed_url"]
      expect(signed_url).to be_present

      parsed = Rack::Utils.parse_query URI(signed_url).query
      date = parsed["date"]
      course_id = parsed["course_id"]
      quiz_id = parsed["quiz_id"]
      user_id = parsed["user_id"]
      signature = parsed["signature"]
      expect(date).to be_present
      expect(course_id.to_i).to eq(exam_request.course_id)
      expect(quiz_id.to_i).to eq(exam_request.exam_id)
      expect(user_id.to_i).to eq(exam_request.student_id)

      proctor_login_secret = Rails.application.secrets.proctor_login_secret
      verifier = ActiveSupport::MessageVerifier.new(proctor_login_secret)
      params = {
        user_id: user_id,
        course_id: course_id,
        quiz_id: quiz_id,
        date: date,
      }.to_query
      signature_verifier = verifier.generate(params)
      expect(signature).to eq(signature_verifier)
    end
  end
end
