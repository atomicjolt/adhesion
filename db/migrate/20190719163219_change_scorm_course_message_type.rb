class ChangeScormCourseMessageType < ActiveRecord::Migration[5.1]
  def up
    change_column :scorm_courses, :message, :text
  end

  def down
    change_column :scorm_courses, :message, :text
  end
end
