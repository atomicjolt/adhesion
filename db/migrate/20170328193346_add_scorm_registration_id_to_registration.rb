class AddScormRegistrationIdToRegistration < ActiveRecord::Migration
  def change
    add_column :registrations, :scorm_registration_id, :string
    add_index :registrations, :scorm_registration_id
  end
end
