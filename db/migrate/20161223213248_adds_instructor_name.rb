class AddsInstructorName < ActiveRecord::Migration
  def change
    add_column :assigned_exams, :instructor_name, :string
  end
end
