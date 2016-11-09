class AddScormCoursePointsPossible < ActiveRecord::Migration
  def change
    add_column :scorm_courses, :points_possible, :float
  end
end
