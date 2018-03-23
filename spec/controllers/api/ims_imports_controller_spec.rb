require "rails_helper"

RSpec.describe Api::ImsImportsController, type: :controller do
  before do
    setup_application_and_instance
    tool_consumer_instance_guid = "4MRcxnx6vQbFXxhLb8005m5WXFM2Z2i8lQwhJ1QT:canvas-lms"
    initial_context_id = "a07291ea2fa1315059ed3bf0135a336d1eebe057"
    @import_context_id = "3155b3a04eba69bc0e52b987d3ffc465156daded"
    @ims_export = FactoryGirl.create(:ims_export)

    lti_launch_tokens = Apartment::Tenant.switch(@application_instance.tenant) do
      @lti_launch_one = FactoryGirl.create(
        :lti_launch,
        context_id: initial_context_id,
        tool_consumer_instance_guid: tool_consumer_instance_guid,
      )
      @lti_launch_two = FactoryGirl.create(
        :lti_launch,
        context_id: initial_context_id,
        tool_consumer_instance_guid: tool_consumer_instance_guid,
      )
      LtiLaunch.where(context_id: initial_context_id).pluck(:token)
    end

    @import_params = {
      context_id: @import_context_id,
      data: {
        context_id: initial_context_id,
        lti_launches: [
          {
            token: "dgqgRSCUGdkmmKMAC3Ma2nei",
            config: {
              scorm_course_id: 41,
              scorm_service_id: "41_1234",
              lms_course_id: "1234",
            },
            scorm_course: {
              points_possible: 100.0,
              title: "meh 1",
            },
            context_id: "3155b3a04eba69bc0e52b987d3ffc465156daded",
            tool_consumer_instance_guid: nil,
          },
          {
            token: "kcgmuAKNyRu55S1kT4XuY5ag",
            config: {
              scorm_course_id: 42,
              scorm_service_id: "42_1234",
              lms_course_id: "1234",
            },
            scorm_course: {
              "$canvas_assignment_id": "1221",
              "$canvas_attachment_id": "5665",
              points_possible: 100.0,
              title: "meh 2",
            },
            context_id: "3155b3a04eba69bc0e52b987d3ffc465156daded",
            tool_consumer_instance_guid: nil,
          },
          {
            token: "jfvTHBDVW68y9auBLGihpq3G",
            config: {
              scorm_course_id: 43,
              scorm_service_id: "43_1234",
              lms_course_id: "1234",
            },
            scorm_course: {
              "$canvas_assignment_id": "1221",
              "$canvas_attachment_id": "$OBJECT_NOT_FOUND",
              points_possible: 100.0,
              title: "meh 3",
            },
            context_id: "3155b3a04eba69bc0e52b987d3ffc465156daded",
            tool_consumer_instance_guid: nil,
          },
          {
            token: "N4aDqFbQzQFrPhqzyZuEJErd",
            config: {
              scorm_course_id: 44,
              scorm_service_id: "44_1234",
              lms_course_id: "1234",
            },
            scorm_course: {
              "$canvas_assignment_id": "1221",
              "$canvas_attachment_id": "7887",
              points_possible: 0.0,
              title: "meh 4",
            },
            context_id: "3155b3a04eba69bc0e52b987d3ffc465156daded",
            tool_consumer_instance_guid: nil,
          },
        ],
        application_instance_id: "3",
        ims_export_id: @ims_export.token,
      },
      tool_consumer_instance_guid: tool_consumer_instance_guid,
      custom_canvas_course_id: "2123",
    }
  end

  context "without jwt token" do
    it "should not be authorized" do
      post :create, params: @import_params, format: :json
      expect(response).to have_http_status(:unauthorized)
    end
  end

  context "with jwt token" do
    before do
      # For authentication a JWT will be included in the Authorization header using the Bearer scheme,
      # it is signed using the shared secret for the tool and will include the stored consumer key in the
      # kid field of the token's header object.
      payload = {}
      @token = AuthToken.issue_token(
        payload,
        24.hours.from_now,
        @application_instance.lti_secret,
        nil,
        { kid: @application_instance.lti_key },
      )
      request.headers["Authorization"] = "Bearer #{@token}"
    end

    describe "POST create" do
      it "starts the import process" do
        post :create, params: @import_params, format: :json
        expect(response).to have_http_status(:success)
        result = JSON.parse(response.body)
        expect(result["status"]).to eq("completed")
        expect(LtiLaunch.find_by(token: "kcgmuAKNyRu55S1kT4XuY5ag")).to be
        expect(LtiLaunch.find_by(token: "jfvTHBDVW68y9auBLGihpq3G")).to be
        expect(LtiLaunch.find_by(token: "N4aDqFbQzQFrPhqzyZuEJErd")).to be

        lti_launch = LtiLaunch.find_by(token: "dgqgRSCUGdkmmKMAC3Ma2nei")
        scorm_course = lti_launch.scorm_course
        expect(lti_launch).to be
        expect(lti_launch.config).to eq(
          {
            scorm_course_id: scorm_course.id,
            scorm_service_id: scorm_course.scorm_service_id,
            lms_course_id: scorm_course.scorm_service_id.split("_").last,
          }.with_indifferent_access,
        )
      end

      it "handles importing the same package multiple times" do
        post :create, params: @import_params, format: :json
        expect(response).to have_http_status(:success)
        result = JSON.parse(response.body)
        expect(result["status"]).to eq("completed")

        post :create, params: @import_params, format: :json
        expect(response).to have_http_status(:success)
        result = JSON.parse(response.body)
        expect(result["status"]).to eq("completed")

        lti_launch = LtiLaunch.find_by(token: "dgqgRSCUGdkmmKMAC3Ma2nei")
        scorm_course = lti_launch.scorm_course
        expect(lti_launch).to be
        expect(lti_launch.config).to eq(
          {
            scorm_course_id: scorm_course.id,
            scorm_service_id: scorm_course.scorm_service_id,
            lms_course_id: scorm_course.scorm_service_id.split("_").last,
          }.with_indifferent_access,
        )
      end
    end
  end
end
