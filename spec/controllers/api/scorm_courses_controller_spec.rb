require "rails_helper"

RSpec.describe Api::ScormCoursesController, type: :controller do
  before do
    @user = FactoryGirl.create(:user)
    @user.confirm
    @user_token = AuthToken.issue_token({ user_id: @user.id })
  end

  before(:example) do
    request.headers["Authorization"] = @user_token
    @mock_scorm = object_double(
      ScormCloudService.new,
      remove_course: { status: 200, response: { removed: true } },
      course_manifest: { status: 200, response: { course: "manifest" } },
      upload_course: { status: 200 },
      list_courses: { status: 200 },
      sync_courses: { test: "data" },
      preview_course: { status: 200, response: { launch_url: "fake_url" } },
    )
    expect(
      controller,
    ).to receive(:scorm_cloud_service).at_most(3).times.and_return(@mock_scorm)
  end

  describe "GET index" do
    it "should return unauthorized without auth token" do
      request.headers["Authorization"] = nil
      get :index, course_id: 1
      expect(response).to have_http_status 401
    end

    it "should return authorized with auth token" do
      get :index, course_id: 1
      expect(response).to have_http_status 200
      expect(JSON.parse(response.body)["response"]["test"]).to eq("data")
    end
  end

  describe "POST create" do
    it "should upload scorm package" do
      expect(@mock_scorm).to receive(:upload_course).with(
        "fake_file",
        "course_id",
      )
      post :create, file: "fake_file", lms_course_id: "course_id"
      expect(response).to have_http_status(200)
    end
  end

  describe "GET show" do
    it "should return course manifest" do
      course = ScormCourse.create
      get :show, id: course.id

      expect(response).to have_http_status 200
      expect(response.body).to include('{"course":"manifest"}')
    end
  end

  describe "PUT update" do
    it "should update scorm package" do
      course = ScormCourse.create
      course_params = { points_possible: "50" }
      put(:update, id: course.id, scorm_course: course_params)
      expect(course.reload.points_possible).to eq(50.0)
      expect(response.body).to include('"points_possible":50.0')
    end
  end

  describe "DEL destroy" do
    it "removes course" do
      ScormCourse.create scorm_cloud_id: 1
      expect(@mock_scorm).to receive(:remove_course).with("1")
      delete :destroy, id: 1
      expect(response).to have_http_status(200)
      expect(JSON.parse(response.body)["response"]["removed"]).to equal(true)
    end
  end

  describe "GET preview" do
    it "should return preview url" do
      get :preview, scorm_course_id: 1
      expect(response).to have_http_status 200
      expect(JSON.parse(
        response.body,
      )["response"]).to eq("launch_url" => "fake_url")
    end
  end
end
