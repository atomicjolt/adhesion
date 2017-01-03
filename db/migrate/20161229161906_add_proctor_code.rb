class AddProctorCode < ActiveRecord::Migration
  def change
    create_table :proctor_codes do |t|
      t.integer :assigned_exam_id
      t.string :code
      t.integer :proctor_id
      t.timestamps null: false
    end
  end
end
