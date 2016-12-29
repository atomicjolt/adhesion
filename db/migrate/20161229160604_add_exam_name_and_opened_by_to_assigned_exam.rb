class AddExamNameAndOpenedByToAssignedExam < ActiveRecord::Migration
  def change
    add_column :assigned_exams, :exam_name, :string
    add_column :assigned_exams, :opened_by_id, :integer
    add_column :assigned_exams, :opened_by_name, :string
  end
end
