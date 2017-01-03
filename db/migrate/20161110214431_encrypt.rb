class Encrypt < ActiveRecord::Migration
  def change
    add_column :registrations, :encrypted_scorm_cloud_passback_secret_iv, :text
    add_column :registrations, :encrypted_scorm_cloud_passback_secret, :text
    remove_column :registrations, :scorm_cloud_passback_secret
  end
end
