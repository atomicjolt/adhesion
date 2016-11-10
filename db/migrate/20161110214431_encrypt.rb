class Encrypt < ActiveRecord::Migration
  def change
    add_column :registrations, :encrypted_scorm_cloud_passback_secret_iv, :text
    add_column :registrations, :encrypted_scorm_cloud_passback_secret, :text
    remove_column :registrations, :scorm_cloud_passback_secret
    remove_column :registrations, :postback_password
  end
end
