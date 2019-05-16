class AddExpiresAtToAtomicDocSession < ActiveRecord::Migration[5.1]
  def change
    add_column :atomic_doc_sessions, :expires_at, :datetime
  end
end
