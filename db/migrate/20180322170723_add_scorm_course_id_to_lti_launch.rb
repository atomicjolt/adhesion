class AddScormCourseIdToLtiLaunch < ActiveRecord::Migration[5.0]
  def change
    add_column :lti_launches, :scorm_course_id, :bigint
    add_index :lti_launches, :scorm_course_id
  end
end
