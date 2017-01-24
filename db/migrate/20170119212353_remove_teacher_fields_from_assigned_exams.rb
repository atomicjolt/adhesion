class RemoveTeacherFieldsFromAssignedExams < ActiveRecord::Migration
  def change
    remove_column :assigned_exams, :instructor_id
    remove_column :assigned_exams, :instructor_name
    add_column :assigned_exams, :message, :string
    change_column_default :assigned_exams, :status, "pending"
  end
end
