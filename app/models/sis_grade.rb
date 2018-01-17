class SisGrade < ApplicationRecord
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
