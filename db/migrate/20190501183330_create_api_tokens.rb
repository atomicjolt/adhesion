class CreateApiTokens < ActiveRecord::Migration[5.1]
  def change
    create_table :api_tokens do |t|
      t.string :name
      t.string :encrypted_token
      t.string :encrypted_token_salt
      t.string :encrypted_token_iv

      t.timestamps
    end

    add_index :api_tokens, :name
  end
end
