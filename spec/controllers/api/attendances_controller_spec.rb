require "rails_helper"

RSpec.describe Api::AttendancesController, type: :controller do
  before do
    @user = FactoryGirl.create(:user)
    @user.confirm
    @user_token = AuthToken.issue_token(user_id: @user.id)
    request.headers["Authorization"] = @user_token
    @course = ScormCourse.create
  end

  describe "GET #index" do
    it "returns http success" do
      get :index, course_id: @course.id
      expect(response).to have_http_status(:success)
    end

    it "returns index json" do
      get :index, course_id: @course.id
      expect(response.content_type).to eq("application/json")
    end
  end

  describe "POST #create" do
    it "successfully creates an attendance" do
      @attendance = FactoryGirl.create(:attendance)
      post :create, course_id: @course.id, attendance_id: @attendance.id
      expect(Attendance.count).to eq(1)
    end

    it "returns index json" do
      @attendance = FactoryGirl.create(:attendance)
      post :create, course_id: @course.id, attendance_id: @attendance.id
      expect(response.content_type).to eq("application/json")
    end

    it "successfully updates existing attendance record" do
      attendance = FactoryGirl.create(:attendance)
      post :create, course_id: @course.id, attendance_id: attendance.id
      attendance["status"] = "ABSENT"
      post :create, course_id: @course.id, attendance_id: attendance.id
      expect(response).to have_http_status(:success)
      expect(response.content_type).to eq("application/json")
      expect(Attendance.count).to eq(1)
    end
  end

  describe "GET #search" do
    it "successfully creates attendance instance variable" do
      attendance = FactoryGirl.create(:attendance)
      get :search, course_id: attendance[:lms_course_id], date: attendance.date
      expect(assigns(:attendances).first).to eq(attendance)
    end

    it "renders json" do
      attendance = FactoryGirl.create(:attendance)
      get :search, course_id: attendance[:lms_course_id], date: attendance.date
      expect(response.content_type).to eq("application/json")
    end
  end
end
