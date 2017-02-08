class RenameAssignedExamToExamRequest < ActiveRecord::Migration
  def change
    rename_table :assigned_exams, :exam_requests
  end
end
