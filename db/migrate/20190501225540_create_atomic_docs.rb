class CreateAtomicDocs < ActiveRecord::Migration[5.1]
  def change
    create_table :atomic_docs do |t|
      t.string :url
      t.string :status
      t.string :file_path

      t.timestamps
    end

    add_index :atomic_docs, :url
  end
end
