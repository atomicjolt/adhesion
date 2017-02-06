class ChangeRegistrationApplicationInstance < ActiveRecord::Migration
  def change
    rename_column :registrations, :lti_application_instance_id, :application_instance_id
  end
end
