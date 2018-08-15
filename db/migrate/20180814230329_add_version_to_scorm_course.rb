class AddVersionToScormCourse < ActiveRecord::Migration[5.1]
  def change
    add_column :scorm_courses, :version, :integer, default: 1
    add_column :registrations, :version, :integer, default: 1
  end
end
