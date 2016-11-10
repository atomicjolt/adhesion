class AddAttendanceSortableName < ActiveRecord::Migration
  def change
    add_column :attendances, :sortable_name, :string
  end
end
