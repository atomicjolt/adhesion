class AddScormActivityIndex < ActiveRecord::Migration
  def change
    add_index :scorm_activities, [:registration_id, :activity_id, :title, :latest_attempt], name: "index_scorm_activities_on_reg_id_act_id_title_latest_attempt"
  end
end
