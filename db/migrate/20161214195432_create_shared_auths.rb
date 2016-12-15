class CreateSharedAuths < ActiveRecord::Migration
  def change
    create_table :shared_auths do |t|
      t.string :secret
      t.timestamps null: false
    end
  end
end
