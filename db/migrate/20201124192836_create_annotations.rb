class CreateAnnotations < ActiveRecord::Migration[5.2]
  def change
    create_table :annotations do |t|
      t.integer :page
      t.string :document_id
      t.string :submission_id
      t.string :annotation_type
      t.float :width
      t.float :height
      t.integer :x
      t.integer :y
      t.integer :size
      t.string :color
      t.string :rectangles
      t.string :lines
      t.text :content

      t.timestamps
    end
  end
end
