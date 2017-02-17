class AddTitleToScormCourses < ActiveRecord::Migration
  def change
    add_column :scorm_courses, :title, :string
  end
end
