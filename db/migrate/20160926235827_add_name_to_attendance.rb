class AddNameToAttendance < ActiveRecord::Migration
  def change
    add_column :attendances, :name, :string 
  end
end
