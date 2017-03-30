class AddScormCourseIdToRegistration < ActiveRecord::Migration
  def up
    change_column :registrations, :lms_course_id, :string
  end

  def down
    change_column :registrations, :lms_course_id, "integer USING CAST(lms_course_id AS integer)"
  end
end
