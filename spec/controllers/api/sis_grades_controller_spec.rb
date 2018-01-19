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
      before do
        @grades_count = 2

        @grade_objects1 = Array.new(@grades_count) do
          {
            sis_user_id: generate(:sis_user_id),
            grade: generate(:common_grade),
          }
        end
        @grade1 = create(
          :sis_grade,
          created_at: Date.today - 6.days,
          grades: @grade_objects1,
          gradetype: SisGrade::MIDTERM,
        )

        @grade_objects2 = Array.new(@grades_count) do
          {
            sis_user_id: generate(:sis_user_id),
            grade: generate(:common_grade),
          }
        end
        @grade2 = create(
          :sis_grade,
          created_at: Date.today - 4.days,
          grades: @grade_objects2,
          gradetype: SisGrade::FINAL,
        )

        @grade_objects3 = Array.new(@grades_count) do
          {
            sis_user_id: generate(:sis_user_id),
            grade: generate(:common_grade),
          }
        end
        @grade3 = create(
          :sis_grade,
          created_at: Date.today - 2.days,
          grades: @grade_objects3,
          gradetype: SisGrade::MIDTERM,
        )
      end

      it "returns an empty array" do
        params = {
          shared_auth: true,
          start_date: Date.today,
          end_date: Date.today,
        }

        get :index, params: params, format: :json

        expect(response).to have_http_status(200)

        sis_grades = JSON.parse(response.body)

        grades = sis_grades["grades"]
        expect(grades).to be_a(Array)
        expect(grades.count).to eq(0)
      end

      it "returns grades based on timestamp" do
        params = {
          shared_auth: true,
          start_date: Date.today - 5.days,
          end_date: Date.today - 3.days,
        }

        get :index, params: params, format: :json

        expect(response).to have_http_status(200)

        sis_grades = JSON.parse(response.body)

        grades = sis_grades["grades"]
        expect(grades.count).to eq(1)
        grade_found = grades.any? { |grade| grade["id"] == @grade2.id }
        expect(grade_found).to be true
      end

      it "returns grades based on timestamp and gradetype" do
        params = {
          shared_auth: true,
          start_date: Date.today - 8.days,
          end_date: Date.today,
          gradetype: SisGrade::FINAL,
        }

        get :index, params: params, format: :json

        expect(response).to have_http_status(200)

        sis_grades = JSON.parse(response.body)

        grades = sis_grades["grades"]
        expect(grades.count).to eq(1)
        grade_found = grades.any? { |grade| grade["id"] == @grade2.id }
        expect(grade_found).to be true
      end

      it "returns grades based on timestamp and sis_course_id" do
        params = {
          shared_auth: true,
          start_date: Date.today - 8.days,
          end_date: Date.today,
          sis_course_id: @grade3.sis_course_id,
        }

        get :index, params: params, format: :json

        expect(response).to have_http_status(200)

        sis_grades = JSON.parse(response.body)

        grades = sis_grades["grades"]
        expect(grades.count).to eq(1)
        grade_found = grades.any? { |grade| grade["id"] == @grade3.id }
        expect(grade_found).to be true
      end

      it "returns grades based on timestamp and sis_section_id" do
        params = {
          shared_auth: true,
          start_date: Date.today - 8.days,
          end_date: Date.today,
          sis_section_id: @grade1.sis_section_id,
        }

        get :index, params: params, format: :json

        expect(response).to have_http_status(200)

        sis_grades = JSON.parse(response.body)

        grades = sis_grades["grades"]

        expect(grades.count).to eq(1)
        grade_found = grades.any? { |grade| grade["id"] == @grade1.id }
        expect(grade_found).to be true
      end

      it "returns paginated grades" do
        params = {
          shared_auth: true,
          start_date: Date.today - 8.days,
          end_date: Date.today,
          page: 1,
          per_page: 2,
        }

        get :index, params: params, format: :json

        expect(response).to have_http_status(200)
        sis_grades = JSON.parse(response.body)

        grades = sis_grades["grades"]

        expect(grades.count).to eq(2)
        grade_found = grades.any? { |grade| grade["id"] == @grade1.id }
        expect(grade_found).to be false
        grade_found = grades.any? { |grade| grade["id"] == @grade2.id }
        expect(grade_found).to be true
        grade_found = grades.any? { |grade| grade["id"] == @grade3.id }
        expect(grade_found).to be true

        expect(sis_grades["total_pages"]).to eq(2)
      end
    end
  end
end
