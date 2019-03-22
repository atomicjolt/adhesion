class AddContextIdToRegistration < ActiveRecord::Migration[5.1]
  def up
    add_column :registrations, :context_id, :string
    remove_index :registrations, [:lms_course_id, :lms_user_id]
    add_index :registrations, [:lms_course_id, :lms_user_id, :context_id], name: "index_registrations_on_lms_course_id_lms_user_id_context_id"
  end

  def down
    remove_index :registrations, [:lms_course_id, :lms_user_id, :context_id]
    add_index :registrations, [:lms_course_id, :lms_user_id]
    remove_column :registrations, :context_id
  end
end
