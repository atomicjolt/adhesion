class AddAssignedExams < ActiveRecord::Migration
  def change
     create_table :assigned_exams do |t|
      t.integer :course_id
      t.integer :exam_id
      t.integer :instructor_id
      t.integer :student_id
      t.integer :testing_center_id
      t.string  :status, :default => "assigned"
      t.timestamps null: false
    end
  end
end
