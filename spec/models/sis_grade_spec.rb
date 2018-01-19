require "rails_helper"

RSpec.describe SisGrade, type: :model do
  context "scopes" do
    before do
      @grade1 = create(
        :sis_grade,
        created_at: Date.today - 6.days,
        gradetype: SisGrade::MIDTERM,
      )

      @grade2 = create(
        :sis_grade,
        created_at: Date.today - 4.days,
        gradetype: SisGrade::FINAL,
      )

      @grade3 = create(
        :sis_grade,
        created_at: Date.today - 2.days,
        gradetype: SisGrade::MIDTERM,
      )
    end

    describe "after_date" do
      it "returns grades after a date" do
        grades = SisGrade.after_date(Date.today - 5.days)
        expect(grades.count).to eq(2)
        expect(grades).to_not include(@grade1)
        expect(grades).to include(@grade2)
        expect(grades).to include(@grade3)
      end
    end

    describe "before_date" do
      it "returns grades before a date" do
        grades = SisGrade.before_date(Date.today - 5.days)
        expect(grades.count).to eq(1)
        expect(grades).to include(@grade1)
        expect(grades).to_not include(@grade2)
        expect(grades).to_not include(@grade3)
      end
    end

    describe "in_between" do
      it "returns grades in between a date" do
        grades = SisGrade.in_between(Date.today - 5.days, Date.today - 1.days)
        expect(grades.count).to eq(2)
        expect(grades).to_not include(@grade1)
        expect(grades).to include(@grade2)
        expect(grades).to include(@grade3)
      end
    end

    describe "for_sis_course_id" do
      it "returns grades for a sis_course_id" do
        grades = SisGrade.for_sis_course_id(@grade1.sis_course_id)
        expect(grades.count).to eq(1)
        expect(grades).to include(@grade1)
        expect(grades).to_not include(@grade2)
        expect(grades).to_not include(@grade3)
      end
    end

    describe "for_sis_section_id" do
      it "returns grades for a sis_section_id" do
        grades = SisGrade.for_sis_section_id(@grade2.sis_section_id)
        expect(grades.count).to eq(1)
        expect(grades).to_not include(@grade1)
        expect(grades).to include(@grade2)
        expect(grades).to_not include(@grade3)
      end
    end

    describe "for_gradetype" do
      it "returns grades for a gradetype SisGrade::MIDTERM" do
        grades = SisGrade.for_gradetype(SisGrade::MIDTERM)
        expect(grades.count).to eq(2)
        expect(grades).to include(@grade1)
        expect(grades).to_not include(@grade2)
        expect(grades).to include(@grade3)
      end

      it "returns grades for a gradetype SisGrade::FINAL" do
        grades = SisGrade.for_gradetype(SisGrade::FINAL)
        expect(grades.count).to eq(1)
        expect(grades).to_not include(@grade1)
        expect(grades).to include(@grade2)
        expect(grades).to_not include(@grade3)
      end
    end
  end

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
