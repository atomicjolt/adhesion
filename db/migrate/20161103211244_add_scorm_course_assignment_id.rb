class AddScormCourseAssignmentId < ActiveRecord::Migration
  def change
      add_column :scorm_courses, :lms_assignment_id, :integer
      add_index :scorm_courses, :lms_assignment_id
  end
end
