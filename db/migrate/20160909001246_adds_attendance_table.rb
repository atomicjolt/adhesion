class AddsAttendanceTable < ActiveRecord::Migration
  def change
    create_table :attendances do |t|
      t.integer :lms_student_id
      t.integer :lms_course_id
      t.string :date
      t.string :status
    end
  end
end
