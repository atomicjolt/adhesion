class AccountIds < ActiveRecord::Migration
  def change
    create_table :testing_centers_accounts do |t|
      t.string :canvas_instance_name
      t.integer :testing_centers_account_id
      t.timestamps null: false
    end
  end
end
