require "rails_helper"

RSpec.describe Api::CoursesController, type: :controller do

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
  end


  describe "GET index" do
    it "should authorize" do
      request.headers['Authorization'] = nil
      get :index, course_id: 1
      expect(response).to have_http_status 401
    end

    let(:scorm_cloud) {instance_double(ScormCloud::ScormCloud)}
    mock_scorm_cloud = ScormCloud::ScormCloud.new("", "")
    mock_course_service = ScormCloud::CourseService.new("")
    mock_course = ScormCloud::Course.new
    mock_course.title = "Fake Course"
    mock_course.id = "123"

    it "should return courses" do
      expect(ScormCloud::ScormCloud).to receive(:new).and_return(mock_scorm_cloud)
      expect(mock_scorm_cloud).to receive(:course).at_least(:once).and_return(mock_course_service)
      expect(mock_course_service).to receive(:get_course_list).at_most(:once).and_return([mock_course])
      get :index, course_id: 1

      response_body = JSON.parse(response.body)
      expect(response_body).to eq([{
        "title" => "Fake Course",
        "id" => "123"
      }])
    end
  end

  describe "GET launch" do
    let(:scorm_cloud) {instance_double(ScormCloud::ScormCloud)}
    mock_scorm_cloud = ScormCloud::ScormCloud.new("", "")
    mock_registration = ScormCloud::RegistrationService.new("")

    it "should authenticate" do
      request.headers['Authorization'] = nil
      get :launch, course_id: 1
      expect(response).to have_http_status(401)
    end

    it "should only create a course if it does not already exist" do
      expect(ScormCloud::ScormCloud).to receive(:new).and_return(mock_scorm_cloud)
      expect(mock_scorm_cloud).to receive(:registration).at_least(:once).and_return(mock_registration)
      expect(mock_registration).to receive(:create_registration).at_most(:once).and_return([ScormCloud::Course.new])
      expect(mock_registration).to receive(:launch).at_least(:once).and_return("http://fake.url.com")

      get :launch, course_id: 1
      get :launch, course_id: 1
    end
  end

  describe "POST create" do
    mock_scorm_cloud = ScormCloud::ScormCloud.new("", "")
    mock_course_service = ScormCloud::CourseService.new("")
    mock_course = ScormCloud::Course.new
    mock_invalid_exception = ScormCloud::InvalidPackageError.new
    mock_cloud_exception = ScormCloud::RequestError.new(REXML::Document.new, "")

    it "should upload scorm package" do
      expect(ScormCloud::ScormCloud).to receive(:new).and_return(mock_scorm_cloud)
      expect(mock_scorm_cloud).to receive(:course).at_least(:once).and_return(mock_course_service)
      expect(mock_course_service).to receive(:import_course).at_most(:once).and_return({
        :title=>"Golf Explained - Run-time Advanced Calls - NEW VERSION",
        :warnings=>[]
      })

      post :create, filename: "fake_file"
      response_body = JSON.parse(response.body)
      expect(response_body).to eq({
        "response"=>{"title"=>"Golf Explained - Run-time Advanced Calls - NEW VERSION", "warnings"=>[]}
      })
      expect(ScormCourse.all.count).to equal(1)
    end

    it "should handle when no file is uploaded" do
      expect(ScormCloud::ScormCloud).to receive(:new).and_return(mock_scorm_cloud)
      expect(mock_scorm_cloud).to receive(:course).at_least(:once).and_return(mock_course_service)
      expect(mock_course_service).to receive(:import_course).at_most(:once).and_raise(mock_invalid_exception)

      post :create, filename: "fake_file"

      expect(response).to have_http_status(400)
    end

    it "should handle scorm cloud error" do
      expect(ScormCloud::ScormCloud).to receive(:new).and_return(mock_scorm_cloud)
      expect(mock_scorm_cloud).to receive(:course).at_least(:once).and_return(mock_course_service)
      expect(mock_course_service).to receive(:import_course).at_most(:once).and_raise(mock_cloud_exception)


      post :create, filename: "fake_file"

      expect(response).to have_http_status(400)
    end
  end

  describe "GET show" do
    mock_scorm_cloud = ScormCloud::ScormCloud.new("", "")
    mock_course_service = ScormCloud::CourseService.new("")
    mock_course = ScormCloud::Course.new
    mock_cloud_exception = ScormCloud::RequestError.new(REXML::Document.new, "")

    it "should return course data" do
      expect(ScormCloud::ScormCloud).to receive(:new).and_return(mock_scorm_cloud)
      expect(mock_scorm_cloud).to receive(:course).at_least(:once).and_return(mock_course_service)
      expect(mock_course_service).to receive(:get_attributes).at_most(:once).and_return({test:"data"})

      get :show, id: 1
      expect(response.body).to include("{\"test\":\"data\"}")
    end

    it "should handle course does not exist" do
      expect(ScormCloud::ScormCloud).to receive(:new).and_return(mock_scorm_cloud)
      expect(mock_scorm_cloud).to receive(:course).at_least(:once).and_return(mock_course_service)
      expect(mock_course_service).to receive(:get_attributes).at_most(:once).and_raise(mock_cloud_exception)

      get :show, id: 1
      expect(response).to have_http_status(400)

    end
  end

  describe "DEL destroy" do
    mock_scorm_cloud = ScormCloud::ScormCloud.new("", "")
    mock_course_service = ScormCloud::CourseService.new("")
    mock_course = ScormCloud::Course.new
    mock_cloud_exception = ScormCloud::RequestError.new(REXML::Document.new, "")

    it "should remove course" do
      expect(ScormCloud::ScormCloud).to receive(:new).and_return(mock_scorm_cloud)
      expect(mock_scorm_cloud).to receive(:course).at_least(:once).and_return(mock_course_service)
      expect(mock_course_service).to receive(:delete_course).at_most(:once).and_return(true)

      course = ScormCourse.create
      expect(ScormCourse.all.count).to equal(1)

      delete :destroy, id:course.id
      expect(ScormCourse.all.count).to equal(0)
    end

    it "should handle when course does not exist" do
      expect(ScormCloud::ScormCloud).to receive(:new).and_return(mock_scorm_cloud)
      expect(mock_scorm_cloud).to receive(:course).at_least(:once).and_return(mock_course_service)
      expect(mock_course_service).to receive(:delete_course).at_most(:once).and_raise(mock_cloud_exception)

      delete :destroy, id:1
      expect(response).to have_http_status 400

    end
  end

  # TODO figure out how to test scorm_cloud_request
  describe "scorm_cloud_request" do
    # mock_cloud_exception = ScormCloud::RequestError.new(REXML::Document.new, "")
    # it "should return response" do
    #   result = controller.scorm_cloud_request do
    #     {result:"Fake Response"}
    #   end
    #   expect(result).to eq({result:"Fake Response"})
    # end

    # it "should catch errors" do
      # expect(controller).to receive(:scorm_cloud_request).at_least(:once).and_raise(mock_cloud_exception)
      # result = controller.scorm_cloud_request do
        # raise ScormCloud::RequestError.new(REXML::Document.new, "")
      # end
      # byebug
      # expect(result).to eq({})

      # get controller.scorm_cloud_request do
      #   raise "HOWDY"
      # end
    # end
  end

  describe "GET preview" do
    mock_scorm_cloud = ScormCloud::ScormCloud.new("", "")
    mock_course_service = ScormCloud::CourseService.new("")
    mock_cloud_exception = ScormCloud::RequestError.new(REXML::Document.new, "")

    it "should return preview url" do
      FAKE_URL = "http://preview.url.com"
      expect(ScormCloud::ScormCloud).to receive(:new).and_return(mock_scorm_cloud)
      expect(mock_scorm_cloud).to receive(:course).at_least(:once).and_return(mock_course_service)
      expect(mock_course_service).to receive(:preview).and_return(FAKE_URL)

      get :preview, course_id: 1
      response_body = JSON.parse(response.body)

      expect(response_body).to eq({"launch_url" => FAKE_URL})
    end

    it "should handle errors" do
      expect(ScormCloud::ScormCloud).to receive(:new).and_return(mock_scorm_cloud)
      expect(mock_scorm_cloud).to receive(:course).at_least(:once).and_return(mock_course_service)
      expect(mock_course_service).to receive(:preview).and_raise(mock_cloud_exception)

      get :preview, course_id: 1
      response_body = JSON.parse(response.body)

      expect(response_body).to eq({"error" => {"msg"=>"Request failed with an unknown error. Entire response: "}})
    end
  end

end
