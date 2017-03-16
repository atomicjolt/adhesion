class AddActivityIdToScormActivity < ActiveRecord::Migration
  def change
    add_column :scorm_activities, :activity_id, :string
    add_index :scorm_activities, [:registration_id, :activity_id, :title], name: "index_scorm_activities_on_registration_id_activity_id_title"
  end
end
