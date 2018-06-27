class ChangeRegistrationStatusToString < ActiveRecord::Migration[5.1]
  def up
    change_column_default :registrations, :status, from: 0, to: nil
    change_column :registrations, :status, :string
  end

  def down
    change_column :registrations, :status, :integer, using: "status::integer", default: 0
  end
end
