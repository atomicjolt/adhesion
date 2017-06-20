class CreateScormActivities < ActiveRecord::Migration
  def change
    create_table :scorm_activities do |t|
      t.string :title
      t.references :registration
      t.boolean :satisfied
      t.boolean :completed
      t.integer :attempts
      t.boolean :suspended
      t.string :completion_status
      t.float :score_scaled
      t.float :score_raw
      t.float :score_min
      t.float :score_max
      t.time :total_time
      t.time :time_tracked
      t.string :success_status
      t.integer :lms_user_id
      t.string :lms_user_name
      t.integer :parent_activity_id
    end
    create_table :scorm_objectives do |t|
      t.references :scorm_activity
      t.boolean :primary
      t.boolean :measure_status
      t.float :normalized_measure
      t.boolean :progress_status
      t.boolean :satisfied_status
    end
    add_index(:scorm_activities, :title)
    add_index(:scorm_activities, :registration_id)
    add_index(:scorm_objectives, :scorm_activity_id)
  end
end
