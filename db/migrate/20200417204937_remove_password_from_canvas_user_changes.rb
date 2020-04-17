class RemovePasswordFromCanvasUserChanges < ActiveRecord::Migration[5.2]
  def change
    remove_column :canvas_user_changes, :password, :json
  end
end
