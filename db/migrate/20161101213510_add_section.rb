class AddSection < ActiveRecord::Migration
  def change

    create_table :sections, force: :cascade do |t|
      t.integer  :course_id
      t.string   :lms_section_id
      t.string   :name
      t.timestamps
    end

    add_index :sections, [:course_id]
    add_index :sections, [:lms_section_id]

  end
end
