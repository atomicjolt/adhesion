require "rails_helper"

RSpec.describe Api::CourseCompletionsController, type: :controller do
  context "no jwt" do
    describe "POST create" do
      it "returns unauthorized" do
        post :create, format: :json
        expect(response).to have_http_status(401)
      end
    end
  end

  def mock_get_enrollment
    @enrollments_response ||= JSON.parse(File.read("spec/fixtures/json/fake_enrollment.json"))

    canvas_api = Object.new
    allow(canvas_api).to receive(:proxy).and_return(@enrollments_response)
    allow(controller).to receive(:canvas_api).and_return(canvas_api)
    allow(controller).to receive(:complete_enrollment).and_return(@enrollments_response.first)
  end

  context "valid jwt" do
    before do
      setup_users
      @user_token_header = "Bearer #{@user_token}"
      mock_get_enrollment
    end

    describe "POST create" do
      before do
        allow(controller).to receive(:current_application_instance).and_return(@application_instance)
        allow(Application).to receive(:find_by).with(:lti_key).and_return(@application_instance)
        request.headers["Authorization"] = @user_token_header
        allow(controller.request).to receive(:host).and_return("example.com")

        @user_grade = generate(:common_grade)
        @grades = [{
          sis_user_id: "SHEL93921",
          grade: @user_grade,
        }]
      end

      describe "POST" do
        it "successfully posts to the course_completion api" do
          params = {
            lti_key: @application_instance.lti_key,
            course_id: 1,
          }
          post :create, params: params, format: :json
          expect(response).to have_http_status(200)
        end

        it "successfully creates a SisGrade" do
          params = {
            lti_key: @application_instance.lti_key,
            course_id: 1,
          }
          expect do
            post :create, params: params, format: :json
          end.to change { SisGrade.count }.by(1)
        end

        it "does not create a duplicate SisGrade" do
          create(
            :sis_grade,
            created_at: Date.today - 6.days,
            sis_course_id: "SHEL93921",
            sis_section_id: "SHEL93921",
            sis_user_id: "SHEL93921",
            grades: @grades,
            gradetype: SisGrade::FINAL,
          )
          params = {
            lti_key: @application_instance.lti_key,
            course_id: 1,
          }
          expect do
            post :create, params: params, format: :json
          end.to change { SisGrade.count }.by(0)
        end
      end
    end
  end
end
