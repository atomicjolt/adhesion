class AccountIds < ActiveRecord::Migration
  def change
    create_table :testing_center_ids do |t|
      t.integer :root_account_id
      t.integer :testing_center_id
      t.timestamps null: false
    end
  end
end
