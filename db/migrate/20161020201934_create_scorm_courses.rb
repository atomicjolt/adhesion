class CreateScormCourses < ActiveRecord::Migration
  def change
    create_table :scorm_courses do |t|
      t.timestamps null: false
    end
  end
end
