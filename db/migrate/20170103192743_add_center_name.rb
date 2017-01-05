class AddCenterName < ActiveRecord::Migration
  def change
    add_column :assigned_exams, :testing_center_name, :string
  end
end
