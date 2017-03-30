class AddCourseUserIndexToRegistration < ActiveRecord::Migration
  def change
    add_index :registrations, [:lms_course_id, :lms_user_id]
  end
end
