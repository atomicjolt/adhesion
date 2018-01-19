class SisGrade < ApplicationRecord
  FINAL = "final".freeze
  MIDTERM = "midterm".freeze

  scope :after_date, ->(date) { where("created_at >= ?", date) }
  scope :before_date, ->(date) { where("created_at <= ?", date) }
  scope :in_between, ->(start_date, end_date) { where("created_at >= ? AND created_at <= ?", start_date, end_date) }
  scope :for_sis_course_id, ->(sis_course_id) { where(sis_course_id: sis_course_id) }
  scope :for_sis_section_id, ->(sis_section_id) { where(sis_section_id: sis_section_id) }
  scope :for_gradetype, ->(gradetype) { where(gradetype: gradetype) }
  scope :by_newest, -> { order(created_at: :desc) }
  scope :by_oldest, -> { order(start_date: :asc) }
  scope :by_latest, -> { order(updated_at: :desc) }

  def update_grades(new_grades)
    new_grades.each do |grade|
      grade_found = grades.detect do |stored_grade|
        stored_grade.with_indifferent_access[:sis_user_id] ==
          grade.with_indifferent_access[:sis_user_id]
      end
      grades << grade if grade_found.nil?
    end
    save! if grades_changed?
  end
end
