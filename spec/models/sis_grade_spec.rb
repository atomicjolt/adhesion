require "rails_helper"

RSpec.describe SisGrade, type: :model do
  describe "update_grades" do
    before do
      @grades = Array.new(2) do
        { sis_user_id: generate(:sis_user_id), grade: generate(:common_grade) }
      end
      @grade = create(:sis_grade, grades: @grades)
    end

    it "adds new grade" do
      @sis_user_id3 = generate(:sis_user_id)
      @user_3_grade = generate(:common_grade)
      new_grades = [
        { sis_user_id: @sis_user_id3, grade: @user_3_grade },
      ]
      @grade.update_grades(new_grades)

      expect(@grade.grades.length).to eq(3)
    end

    it "doesn't update grades" do
      sis_user_id = @grades.first[:sis_user_id]
      user_2_new_grade = generate(:common_grade)
      new_grades = [
        { sis_user_id: sis_user_id, grade: user_2_new_grade },
      ]
      @grade.update_grades(new_grades)

      expect(@grade.grades.length).to eq(2)
    end
  end

  describe "update_grades speed test" do
    before do
      @grades = Array.new(3000) do
        { sis_user_id: generate(:sis_user_id), grade: generate(:common_grade) }
      end
      @grade = create(:sis_grade, grades: @grades)
    end

    it "adds new grade in a timely manner" do
      @sis_user_id3 = generate(:sis_user_id)
      @user_3_grade = generate(:common_grade)
      new_grades = [
        { sis_user_id: @sis_user_id3, grade: @user_3_grade },
      ]

      time_start = Time.now
      @grade.update_grades(new_grades)
      time_end = Time.now

      elapsed_time = time_end - time_start

      expect(elapsed_time).to be < 1.second
    end
  end
end
