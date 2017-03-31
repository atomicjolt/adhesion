class ChangeScormCloudIdOnScormCourse < ActiveRecord::Migration
  def change
    rename_column :scorm_courses, :scorm_cloud_id, :scorm_service_id
  end
end
