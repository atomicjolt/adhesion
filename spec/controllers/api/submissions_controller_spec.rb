require "rails_helper"

RSpec.describe Api::SubmissionsController, type: :controller do
  include ActiveJob::TestHelper

  after do
    clear_enqueued_jobs
  end

  context "no jwt" do
    describe "POST create" do
      it "returns unauthorized" do
        post :create, format: :json
        expect(response).to have_http_status(401)
      end
    end
  end

  context "valid jwt" do
    before do
      canvas_api_permissions = {
        default: [
          "administrator", # Internal (non-LTI) role
          "urn:lti:sysrole:ims/lis/SysAdmin",
          "urn:lti:sysrole:ims/lis/Administrator",
          "urn:lti:role:ims/lis/Learner",
        ],
        common: [],
        LIST_ENROLLMENTS_SECTIONS: [],
        LIST_ASSIGNMENT_SUBMISSIONS_SECTIONS: [],
      }
      @application = create(
        :application,
        canvas_api_permissions: canvas_api_permissions,
      )
      @application_instance = create(:application_instance, application: @application)
      @user = create(:user, lms_user_id: 1)
      @user.confirm
      @user.add_to_role("urn:lti:role:ims/lis/Learner")
      @user.save!
      @user_token = AuthToken.issue_token({ user_id: @user.id })
      @user_token_header = "Bearer #{@user_token}"
    end

    describe "POST create" do
      before do
        allow(controller).to receive(:current_application_instance).and_return(@application_instance)
        allow(Application).to receive(:find_by).with(:lti_key).and_return(@application_instance)
        request.headers["Authorization"] = @user_token_header
        allow(controller.request).to receive(:host).and_return("example.com")
      end

      describe "POST" do
        context "total" do
          before do
            @params = {
              lti_key: @application_instance.lti_key,
              sections: [
                {
                  id: "-1", # section dropdown default value
                },
                {
                  id: "626",
                  sis_section_id: "section_a",
                  sis_course_id: "course_a",
                },
              ],
              gradetype: generate(:gradetype),
              assignment_id: "total",
            }
          end

          it "successfully posts to the submissions api" do
            post :create, params: @params, format: :json
            expect(response).to have_http_status(:success)
          end

          it "enqueues PostGradesJob" do
            data = {
              gradetype: @params[:gradetype],
              assignment_id: @params[:assignment_id],
              sections: @params[:sections],
            }
            expect do
              post :create, params: @params, format: :json
            end.to have_enqueued_job(PostGradesJob).with(
              data.to_json,
              @application_instance,
              @user,
            )
          end
        end

        context "for specific assignment" do
          before do
            @params = {
              lti_key: @application_instance.lti_key,
              sections: [
                {
                  id: "-1", # section dropdown default value
                },
                {
                  id: "626",
                  sis_section_id: "section_b",
                  sis_course_id: "course_b",
                },
              ],
              gradetype: generate(:gradetype),
              assignment_id: "16753",
            }
          end

          it "successfully posts to the submissions api" do
            post :create, params: @params, format: :json
            expect(response).to have_http_status(:success)
          end

          it "enqueues PostGradesJob" do
            data = {
              gradetype: @params[:gradetype],
              assignment_id: @params[:assignment_id],
              sections: @params[:sections],
            }
            expect do
              post :create, params: @params, format: :json
            end.to have_enqueued_job(PostGradesJob).with(
              data.to_json,
              @application_instance,
              @user,
            )
          end
        end
      end
    end
  end
end
