class AddScormCloudPlainIdToScormCourse < ActiveRecord::Migration
  def change
    add_column :scorm_courses, :scorm_cloud_plain_id, :integer
    add_index :scorm_courses, :scorm_cloud_plain_id
  end
end
