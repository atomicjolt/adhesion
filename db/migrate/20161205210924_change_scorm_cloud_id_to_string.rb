class ChangeScormCloudIdToString < ActiveRecord::Migration
  def up
    change_column :scorm_courses, :scorm_cloud_id, :string
  end

  def down
    change_column :scorm_courses, :scorm_cloud_id, :integer
  end
end
