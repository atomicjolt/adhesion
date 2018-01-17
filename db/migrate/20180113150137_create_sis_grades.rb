class CreateSisGrades < ActiveRecord::Migration[5.0]
  def change
    create_table :sis_grades do |t|
      t.string :sis_course_id
      t.string :sis_section_id
      t.string :gradetype
      t.jsonb :grades, default: []

      t.timestamps
    end
  end
end
