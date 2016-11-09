class AttendanceDate < ActiveRecord::Migration
  def change
    change_column :attendances, :date, :date, using: "Date::Date"
  end
end
