class UpdateScormActivityIndex < ActiveRecord::Migration
  def up
    remove_index :scorm_activities, name: "index_scorm_activities_on_registration_id_activity_id_title"
  end

  def down
    add_index :scorm_activities, [:registration_id, :activity_id, :title], name: "index_scorm_activities_on_registration_id_activity_id_title"
  end
end
