class CreateAnnotationComments < ActiveRecord::Migration[5.2]
  def change
    create_table :annotation_comments do |t|
      t.uuid :uuid
      t.uuid :annotation
      t.text :content

      t.timestamps
    end
  end
end
