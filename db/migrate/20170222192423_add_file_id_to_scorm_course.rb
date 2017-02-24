class AddFileIdToScormCourse < ActiveRecord::Migration
  def change
    add_column :scorm_courses, :file_id, :integer
  end
end
