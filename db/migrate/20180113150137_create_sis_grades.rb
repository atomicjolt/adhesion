class CreateSisGrades < ActiveRecord::Migration[5.0]
  def change
    create_table :sis_grades do |t|
      t.string :sis_course_id
      t.string :sis_section_id
      t.string :gradetype
      t.jsonb :grades, default: []

      t.timestamps
    end

    add_index :sis_grades, %i[created_at gradetype sis_course_id sis_section_id], name: "index_sis_grades_on_created_at_gradetype_course_id_section_id"
  end
end
