class UpdateScormActivity < ActiveRecord::Migration
  def change
    add_column :scorm_activities, :latest_attempt, :boolean
    add_index :scorm_activities, [:registration_id, :activity_id, :title, :attempts], name: "index_scorm_activities_on_reg_id_activity_id_title_attempt"
    add_index :scorm_activities, [:registration_id, :latest_attempt]
  end
end
