class RemoveScormCloudPlainIdFromRegistration < ActiveRecord::Migration
  def up
    remove_index :scorm_courses, :scorm_cloud_plain_id
    remove_column :scorm_courses, :scorm_cloud_plain_id
  end

  def down
    add_column :scorm_courses, :scorm_cloud_plain_id, :integer
    add_index :scorm_courses, :scorm_cloud_plain_id
  end
end
