class AddIndexToAttendance < ActiveRecord::Migration[5.0]
  def change
    add_index :attendances, %i[lms_course_id date lms_student_id]
    add_index :attendances, %i[lms_course_id date status]
  end
end
