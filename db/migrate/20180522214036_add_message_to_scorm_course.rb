class AddMessageToScormCourse < ActiveRecord::Migration[5.0]
  def change
    add_column :scorm_courses, :message, :string, limit: 2048
  end
end
