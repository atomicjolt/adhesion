class AddRegistrationLtiParams < ActiveRecord::Migration
  def change
      add_column :registrations, :lis_result_sourcedid, :text, default: ""
      add_column :registrations, :lis_outcome_service_url, :text, default: ""
  end
end
