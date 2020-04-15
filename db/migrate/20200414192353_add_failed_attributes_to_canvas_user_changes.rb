class AddFailedAttributesToCanvasUserChanges < ActiveRecord::Migration[5.2]
  def change
    add_column :canvas_user_changes, :failed_attributes, :string, array: true
  end
end
