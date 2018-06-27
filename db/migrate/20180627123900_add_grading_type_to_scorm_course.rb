class AddGradingTypeToScormCourse < ActiveRecord::Migration[5.1]
  def change
    add_column :scorm_courses, :grading_type, :string
  end
end
