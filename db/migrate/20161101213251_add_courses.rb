class AddCourses < ActiveRecord::Migration

  def change
    create_table :courses, force: :cascade do |t|
      t.string  :lms_course_id
      t.string  :name
      t.timestamps
    end

    add_index :courses, [:lms_course_id]

    create_table :user_courses, force: :cascade do |t|
      t.integer :user_id
      t.integer :course_id
      t.integer :role_id,    default: 2
      t.integer :section_id
    end

    add_index :user_courses, [:course_id]
    add_index :user_courses, [:role_id]
    add_index :user_courses, [:section_id]
    add_index :user_courses, [:user_id]

  end

end
