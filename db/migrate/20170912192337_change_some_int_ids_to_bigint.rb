class ChangeSomeIntIdsToBigint < ActiveRecord::Migration
  def change
    change_column :attendances, :id, :bigint
    change_column :authentications, :id, :bigint
    change_column :exam_requests, :id, :bigint
    change_column :nonces, :id, :bigint
    change_column :permissions, :id, :bigint
    change_column :registrations, :id, :bigint
    change_column :scorm_activities, :id, :bigint
    change_column :scorm_objectives, :id, :bigint
    change_column :shared_auths, :id, :bigint
    change_column :users, :id, :bigint

    change_column :scorm_activities, :registration_id, :bigint
    change_column :scorm_objectives, :scorm_activity_id, :bigint
    change_column :authentications, :user_id, :bigint
    change_column :permissions, :user_id, :bigint
    change_column :user_courses, :user_id, :bigint
  end
end
