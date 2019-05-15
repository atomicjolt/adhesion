class CreateAtomicDocSessions < ActiveRecord::Migration[5.1]
  def change
    create_table :atomic_doc_sessions do |t|
      t.string :session_id
      t.bigint :atomic_doc_id

      t.timestamps
    end

    add_index :atomic_doc_sessions, :session_id, unique: true
  end
end
