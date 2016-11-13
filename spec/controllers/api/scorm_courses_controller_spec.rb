require "rails_helper"

RSpec.describe Api::ScormCoursesController, type: :controller do

  before do
    # @account = FactoryGirl.create(:account)
    # user1 = FactoryGirl.attributes_for(:user)
    # @account.users.create(user1)
    # user2 = FactoryGirl.attributes_for(:user)
    # @account.users.create(user2)
    # user3 = FactoryGirl.attributes_for(:user)
    # @account.users.create(user3)
    #
    @user = FactoryGirl.create(:user)
    @user.confirm

    # @admin = CreateAdminService.create_admin(@account)

    @user_token = AuthToken.issue_token({ user_id: @user.id })
    # @admin_token = AuthToken.issue_token({ user_id: @admin.id })

  end

  before(:example) do
    request.headers['Authorization'] = @user_token
    @mock_scorm = object_double(
      ScormCloudService.new,
      remove_course: {status: 200, response: {course: "manifest"}},
      course_manifest: {status: 200, response: {course: "manifest"}},
      upload_course: {status: 200},
      :list_courses => {status: 200},
      :sync_courses => {test:"data"}
    )
  end

  describe "GET index" do
    it "should return unauthorized without auth token" do
      request.headers['Authorization'] = nil
      get :index, course_id: 1
      expect(response).to have_http_status 401
    end

    it "should return authorized with auth token" do
      expect(controller).to receive(:scorm_cloud_service).at_least(1).times.and_return(
        @mock_scorm
      )
      get :index, course_id: 1
      expect(response).to have_http_status 200
      expect(JSON.parse(response.body)["response"]["test"]).to eq("data")
    end
  end

  describe "POST create" do
    it "should upload scorm package" do
      expect(controller).to receive(:scorm_cloud_service).and_return(@mock_scorm)
      expect(@mock_scorm).to receive(:upload_course).with("fake_file")
      post :create, file: "fake_file"
      expect(response).to have_http_status(200)
    end
  end

  describe "GET show" do
    it "should return course manifest" do
      course = ScormCourse.create
      expect(controller).to receive(:scorm_cloud_service).and_return(@mock_scorm)
      get :show, id: course.id

      expect(response).to have_http_status 200
      expect(response.body).to include('{"course":"manifest"}')
    end
  end

  describe "DEL destroy" do
    # it "removes course" do
      # course = ScormCourse.create
    # end

  #   mock_scorm_cloud = ScormCloud::ScormCloud.new("", "")
  #   mock_course_service = ScormCloud::CourseService.new("")
  #   mock_course = ScormCloud::Course.new
  #   mock_cloud_exception = ScormCloud::RequestError.new(REXML::Document.new, "")
  #
  #   it "should remove course" do
  #     expect(ScormCloud::ScormCloud).to receive(:new).and_return(mock_scorm_cloud)
  #     expect(mock_scorm_cloud).to receive(:course).at_least(:once).and_return(mock_course_service)
  #     expect(mock_course_service).to receive(:delete_course).at_most(:once).and_return(true)
  #
  #     course = ScormCourse.create
  #     expect(ScormCourse.all.count).to equal(1)
  #
  #     delete :destroy, id:course.id
  #     expect(ScormCourse.all.count).to equal(0)
  #   end
  #
  #   it "should handle when course does not exist" do
  #     expect(ScormCloud::ScormCloud).to receive(:new).and_return(mock_scorm_cloud)
  #     expect(mock_scorm_cloud).to receive(:course).at_least(:once).and_return(mock_course_service)
  #     expect(mock_course_service).to receive(:delete_course).at_most(:once).and_raise(mock_cloud_exception)
  #
  #     delete :destroy, id:1
  #     expect(response).to have_http_status 400
  #
  #   end
  end
  #
  # # TODO figure out how to test scorm_cloud_request
  # describe "scorm_cloud_request" do
  #   # mock_cloud_exception = ScormCloud::RequestError.new(REXML::Document.new, "")
  #   # it "should return response" do
  #   #   result = controller.scorm_cloud_request do
  #   #     {result:"Fake Response"}
  #   #   end
  #   #   expect(result).to eq({result:"Fake Response"})
  #   # end
  #
  #   # it "should catch errors" do
  #     # expect(controller).to receive(:scorm_cloud_request).at_least(:once).and_raise(mock_cloud_exception)
  #     # result = controller.scorm_cloud_request do
  #       # raise ScormCloud::RequestError.new(REXML::Document.new, "")
  #     # end
  #     # byebug
  #     # expect(result).to eq({})
  #
  #     # get controller.scorm_cloud_request do
  #     #   raise "HOWDY"
  #     # end
  #   # end
  # end
  #
  # describe "GET preview" do
  #   mock_scorm_cloud = ScormCloud::ScormCloud.new("", "")
  #   mock_course_service = ScormCloud::CourseService.new("")
  #   mock_cloud_exception = ScormCloud::RequestError.new(REXML::Document.new, "")
  #
  #   it "should return preview url" do
  #     FAKE_URL = "http://preview.url.com"
  #     expect(ScormCloud::ScormCloud).to receive(:new).and_return(mock_scorm_cloud)
  #     expect(mock_scorm_cloud).to receive(:course).at_least(:once).and_return(mock_course_service)
  #     expect(mock_course_service).to receive(:preview).and_return(FAKE_URL)
  #
  #     get :preview, course_id: 1
  #     response_body = JSON.parse(response.body)
  #
  #     expect(response_body).to eq({"launch_url" => FAKE_URL})
  #   end
  #
  #   it "should handle errors" do
  #     expect(ScormCloud::ScormCloud).to receive(:new).and_return(mock_scorm_cloud)
  #     expect(mock_scorm_cloud).to receive(:course).at_least(:once).and_return(mock_course_service)
  #     expect(mock_course_service).to receive(:preview).and_raise(mock_cloud_exception)
  #
  #     get :preview, course_id: 1
  #     response_body = JSON.parse(response.body)
  #
  #     expect(response_body).to eq({"error" => {"msg"=>"Request failed with an unknown error. Entire response: "}})
  #   end
  # end
  #
end
