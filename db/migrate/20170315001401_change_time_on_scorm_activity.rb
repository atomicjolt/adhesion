class ChangeTimeOnScormActivity < ActiveRecord::Migration
  def up
    remove_column :scorm_activities, :total_time
    remove_column :scorm_activities, :time_tracked

    add_column :scorm_activities, :total_time, :integer
    add_column :scorm_activities, :time_tracked, :integer
  end

  def down
    remove_column :scorm_activities, :total_time
    remove_column :scorm_activities, :time_tracked

    add_column :scorm_activities, :total_time, :time
    add_column :scorm_activities, :time_tracked, :time
  end
end
