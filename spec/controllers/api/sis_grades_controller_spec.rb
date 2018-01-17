require "rails_helper"

RSpec.describe Api::SisGradesController, type: :controller do
  context "no jwt" do
    describe "GET index" do
      it "returns unauthorized" do
        get :index, format: :json
        expect(response).to have_http_status(401)
      end
    end
  end

  context "as shared auth" do
    before do
      secret = Rails.application.secrets.shared_sis_auth_secret
      @shared_token = AuthToken.issue_token({}, 24.hours.from_now, secret)

      request.headers["Authorization"] = @shared_token
    end

    describe "GET index" do
      context "user is an admin that has authenticated with canvas" do
        it "renders all canvas accounts as json" do
          grades_count = 2
          @grades = Array.new(grades_count) do
            { "sis_user_id" => generate(:sis_user_id), "grade" => generate(:common_grade) }
          end

          @grade = create(:sis_grade, grades: @grades)

          params = {
            shared_auth: true,
            sis_course_id: @grade.sis_course_id,
            sis_section_id: @grade.sis_section_id,
            gradetype: @grade.gradetype,
          }

          get :index, params: params, format: :json

          expect(response).to have_http_status(200)

          grades = JSON.parse(response.body)
          expect(grades.count).to eq(grades_count)
          expect(grades).to include(@grades.first)
          expect(grades).to include(@grades.second)
        end
      end
    end
  end
end
