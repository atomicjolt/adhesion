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

    it "set attendances variable" do
      get :index, course_id: @course.id
      expect(assigns(:attendances)).to eq([])
    end

    it "returns index json" do
      get :index, course_id: @course.id
    end
  end
end
