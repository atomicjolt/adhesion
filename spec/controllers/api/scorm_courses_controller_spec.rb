require "rails_helper"

RSpec.describe Api::ScormCoursesController, type: :controller do
  before do
    setup_application_instance
    @user = FactoryBot.create(:user)
    @user.confirm
    @user_token = AuthToken.issue_token(
      {
        application_instance_id: @application_instance.id,
        user_id: @user.id,
        lms_course_id: "123",
        tool_consumer_instance_guid: "123abc",
        context_id: "456def",
      },
    )
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
    ).to receive(:scorm_connect_service).at_most(3).times.and_return(@mock_scorm)
  end

  describe "GET index" do
    it "should return unauthorized without auth token" do
      request.headers["Authorization"] = nil
      params = { course_id: 1 }
      get :index, params: params
      expect(response).to have_http_status 401
    end

    it "should return authorized with auth token" do
      params = { course_id: 1 }
      get :index, params: params
      expect(response).to have_http_status 200
      expect(JSON.parse(response.body)["response"]["test"]).to eq("data")
    end
  end

  describe "POST create" do
    before do
      class Foo
        def path; end
      end

      @file = Foo.new

      allow(controller).to receive(:copy_to_storage).and_return(@file)
    end

    it "should upload scorm package" do
      expect(ScormImportJob).to receive(:perform_later)

      params = {
        file: "fake_file",
        lms_course_id: "course_id",
      }

      post :create, params: params

      expect(response).to have_http_status(200)
    end

    it "should create an LtiLaunch" do
      allow(ScormImportJob).to receive(:perform_later)

      params = {
        file: "fake_file",
        lms_course_id: "course_id",
      }

      post :create, params: params

      scorm_course_id = JSON.parse(response.body)["scorm_course_id"]
      scorm_course = ScormCourse.find(scorm_course_id)
      lti_launch = scorm_course.lti_launch
      expect(lti_launch).to be
      expect(lti_launch.config).to eq(
        {
          scorm_course_id: scorm_course.id,
          scorm_service_id: scorm_course.scorm_service_id,
          lms_course_id: scorm_course.scorm_service_id.split("_").last,
        }.with_indifferent_access,
      )
      expect(lti_launch.tool_consumer_instance_guid).to eq("123abc")
      expect(lti_launch.context_id).to eq("456def")
    end
  end

  describe "GET show" do
    it "should return course manifest" do
      course = create(:scorm_course)
      params = { id: course.id }
      get :show, params: params

      expect(response).to have_http_status 200
      expect(response.body).to include('{"course":"manifest"}')
    end
  end

  describe "PUT update" do
    it "should update scorm package" do
      course = create(:scorm_course)
      course_params = { points_possible: "50" }
      params = {
        id: course.scorm_service_id,
        scorm_course: course_params,
        scorm_assignment_data: {
          assignment: {
            name: "bfcoder",
            points_possible: course_params[:points_possible],
          },
        },
      }
      create(:lti_launch, scorm_course: course)
      put :update, params: params
      expect(course.reload.points_possible).to eq(50.0)
      expect(response.body).to include('"points_possible":50.0')
    end
  end

  describe "DEL destroy" do
    it "removes course" do
      ScormCourse.create scorm_service_id: 1
      expect(@mock_scorm).to receive(:remove_course).with("1")
      params = { id: 1 }
      delete :destroy, params: params
      expect(response).to have_http_status(200)
      expect(JSON.parse(response.body)["response"]["removed"]).to equal(true)
    end
  end

  describe "GET preview" do
    it "should return preview url" do
      params = { scorm_course_id: 1 }
      get :preview, params: params
      expect(response).to have_http_status 200
      expect(JSON.parse(
        response.body,
      )["response"]).to eq("launch_url" => "fake_url")
    end
  end

  describe "GET status" do
    it "should return the status" do
      scorm_course = create(:scorm_course, import_job_status: "RUNNING")
      params = { scorm_course_id: scorm_course.id }
      get :status, params: params
      expect(response).to have_http_status 200
      expected = { "scorm_course_id" => scorm_course.id, "status" => "RUNNING", "message" => nil }
      expect(JSON.parse(response.body)).to eq(expected)
    end

    it "should return the status with a message" do
      scorm_course = create(
        :scorm_course,
        import_job_status: "FAILED",
        message: "Specified zip does not contain a manifest.",
      )
      params = { scorm_course_id: scorm_course.id }
      get :status, params: params
      expect(response).to have_http_status 200
      expected = {
        "scorm_course_id" => scorm_course.id,
        "status" => "FAILED",
        "message" => "Specified zip does not contain a manifest.",
      }
      expect(JSON.parse(response.body)).to eq(expected)
    end
  end

  describe "GET course_report" do
    it "should return course analytics data" do
      course = create(:scorm_course)
      params = { scorm_course_id: course.scorm_service_id }
      get :course_report, params: params
      expect(response).to have_http_status 200
      expect(JSON.parse(response.body)).to include("scores")
    end
  end

  describe "GET activity_report" do
    it "should return student course analytics data" do
      course = create(:scorm_course)
      params = { scorm_course_id: course.scorm_service_id }
      get :activity_report, params: params
      expect(response).to have_http_status 200
      expect(JSON.parse(response.body)).to include("analytics_table")
    end
  end
end
