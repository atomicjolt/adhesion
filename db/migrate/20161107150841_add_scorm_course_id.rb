class AddScormCourseId < ActiveRecord::Migration
  def change
    add_column :scorm_courses, :scorm_cloud_id, :integer
    add_index :scorm_courses, :scorm_cloud_id, :unique => true
  end
end
