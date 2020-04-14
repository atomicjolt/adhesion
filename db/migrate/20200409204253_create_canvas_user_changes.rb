class CreateCanvasUserChanges < ActiveRecord::Migration[5.2]
  def change
    create_table :canvas_user_changes do |t|
      t.bigint :admin_making_changes_lms_id, null: false
      t.bigint :user_being_changed_lms_id, null: false

      t.json :name
      t.json :login_id
      t.json :password
      t.json :sis_user_id
      t.json :email

      t.timestamps
    end
  end
end
