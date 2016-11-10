class AddRegistrationPostbackPassword < ActiveRecord::Migration
  def change
    add_column :registrations, :scorm_cloud_passback_secret, :text
  end
end
