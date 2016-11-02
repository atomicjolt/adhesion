class AddRegistrationLtiApp < ActiveRecord::Migration
  def change
    add_column :registrations, :lti_application_id, :integer
    add_index :registrations, :lti_application_id
  end
end
