require "rails_helper"

RSpec.describe Api::ExamRequestsController, type: :controller do
  before do
    setup_users
    request.headers["Authorization"] = @user_token
  end

  describe "GET #index" do
    it "returns exam requests for student" do
      student = create(:user)
      exam_request = create(:exam_request, student_id: student.id)
      get :index, params: { student_id: student.id }
      expect(response).to be_successful
      exam_requests = JSON.parse(response.body)
      expect(exam_requests.count).to eq(1)
      found = exam_requests.any? { |er| er["id"] == exam_request.id }
      expect(found).to eq(true)
    end

    it "returns exam requests for student" do
      exam_request = create(:exam_request, testing_center_id: 123)
      get :index, params: { testing_center_id: 123 }
      expect(response).to be_successful
      exam_requests = JSON.parse(response.body)
      expect(exam_requests.count).to eq(1)
      found = exam_requests.any? { |er| er["id"] == exam_request.id }
      expect(found).to eq(true)
    end
  end

  describe "POST #create" do
    before do
      @params = {
        exam_request: attributes_for(:exam_request),
      }
    end
    it "successfully creates an exam request" do
      expect { post :create, params: @params }.to change { ExamRequest.count }.by(1)
    end

    it "successfully deletes and creates exam request" do
      params = @params.clone
      params[:student_id] = params[:exam_request][:student_id]
      params[:exam_id] = params[:exam_request][:exam_id]
      create(
        :exam_request,
        student_id: params[:student_id],
        exam_id: params[:exam_id],
      )
      expect { post :create, params: params }.to change { ExamRequest.count }.by(0)
    end
  end

  describe "PUT #update" do
    it "should update exam request" do
      exam_request = create(:exam_request)
      exam_request_params = {
        scheduled_date: Date.today + 2.days,
        scheduled_time: Time.now + 2.days,
        status: "meh",
      }
      put :update, params: { id: exam_request.id, exam_request: exam_request_params }
      expect(response).to be_successful
      updated_exam_request = JSON.parse(response.body)
      expect(updated_exam_request["status"]).to eq(exam_request_params[:status])
    end
  end

  describe "DELETE #destroy" do
    it "should destroy the exam request" do
      exam_request = create(:exam_request)
      delete :destroy, params: { id: exam_request.id }
      expect(response).to be_successful
    end
  end
end
