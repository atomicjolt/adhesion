class AddResourceLinkIdToScormCourse < ActiveRecord::Migration[5.0]
  def change
    add_column :scorm_courses, :resource_link_id, :string
  end
end
