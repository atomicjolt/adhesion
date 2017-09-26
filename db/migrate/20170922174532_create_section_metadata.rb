class CreateSectionMetadata < ActiveRecord::Migration[5.0]
  def change
    create_table :section_metadata do |t|
      t.integer :lms_course_id
      t.integer :lms_section_id
      t.boolean :any_posted
      t.datetime :mid_posted
      t.datetime :final_posted
    end
  end
end
