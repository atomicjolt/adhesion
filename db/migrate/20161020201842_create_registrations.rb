class CreateRegistrations < ActiveRecord::Migration
  def change
    create_table :registrations do |t|
      t.integer :lms_course_id
      t.integer :lms_user_id
      t.timestamps null: false
    end
    add_index(:registrations, :lms_course_id)
    add_index(:registrations, :lms_user_id)
  end
end
