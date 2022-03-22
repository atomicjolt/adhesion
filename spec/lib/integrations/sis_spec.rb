require "rails_helper"

describe Integrations::Sis, type: :integration do
  describe "post_grades_to_db" do
    context "for a user" do
      before do
        @sis_course_id = generate(:sis_course_id)
        @sis_section_id = generate(:sis_section_id)
        @sis_user_id = generate(:sis_user_id)
        @user_grade = generate(:common_grade)
        @grades = [{
          sis_user_id: @sis_user_id,
          grade: @user_grade,
        }]
      end

      it "creates new sis_grade" do
        expect do
          Integrations::Sis.post_grades_to_db(
            @sis_course_id,
            @sis_section_id,
            SisGrade::FINAL,
            @grades,
            @sis_user_id,
          )
        end.to change { SisGrade.count }.by(1)
      end

      it "does not create a new sis_grade" do
        create(
          :sis_grade,
          created_at: Date.today - 6.days,
          sis_course_id: @sis_course_id,
          sis_section_id: @sis_section_id,
          sis_user_id: @sis_user_id,
          grades: @grades,
          gradetype: SisGrade::FINAL,
        )
        expect do
          Integrations::Sis.post_grades_to_db(
            @sis_course_id,
            @sis_section_id,
            SisGrade::FINAL,
            @grades,
            @sis_user_id,
          )
        end.to change { SisGrade.count }.by(0)
      end
    end

    context "for a course" do
      before do
        @sis_course_id = generate(:sis_course_id)
        @sis_section_id = generate(:sis_section_id)
        @sis_user_id1 = generate(:sis_user_id)
        @user_1_grade = generate(:common_grade)
        @sis_user_id2 = generate(:sis_user_id)
        @user_2_grade = generate(:common_grade)
        @sis_user_id3 = generate(:sis_user_id)
        @user_3_grade = generate(:common_grade)
        @grades = [
          {
            sis_user_id: @sis_user_id1,
            grade: @user_1_grade,
          },
          {
            sis_user_id: @sis_user_id2,
            grade: @user_2_grade,
          },
          {
            sis_user_id: @sis_user_id3,
            grade: @user_3_grade,
          },
        ]
      end

      it "creates new sis_grade" do
        expect do
          Integrations::Sis.post_grades_to_db(
            @sis_course_id,
            @sis_section_id,
            SisGrade::FINAL,
            @grades,
          )
        end.to change { SisGrade.count }.by(1)
      end

      it "does not create a new sis_grade" do
        create(
          :sis_grade,
          created_at: Date.today - 6.days,
          sis_course_id: @sis_course_id,
          sis_section_id: @sis_section_id,
          grades: @grades,
          gradetype: SisGrade::FINAL,
        )
        expect do
          Integrations::Sis.post_grades_to_db(
            @sis_course_id,
            @sis_section_id,
            SisGrade::FINAL,
            @grades,
          )
        end.to change { SisGrade.count }.by(0)
      end
    end
  end
end
