class AddRegistrationPostback < ActiveRecord::Migration
  def change
    add_column :registrations, :status, :integer, default: 0
    add_column :registrations, :score, :decimal, default: 0.0
  end
end
