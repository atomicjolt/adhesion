class ChangeRegistrationLtiApplicationInstance < ActiveRecord::Migration
  def change
    rename_column :registrations, :lti_application_id, :lti_application_instance_id
  end
end
