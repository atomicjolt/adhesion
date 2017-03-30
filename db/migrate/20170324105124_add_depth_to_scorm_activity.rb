class AddDepthToScormActivity < ActiveRecord::Migration
  def change
    add_column :scorm_activities, :depth, :integer
  end
end
