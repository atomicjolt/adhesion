class CreateAnnotationComments < ActiveRecord::Migration[5.2]
  def change
    create_table :annotation_comments do |t|
      t.string :document_id
      t.belongs_to :annotation, index: true
      t.text :content

      t.timestamps
    end
  end
end
