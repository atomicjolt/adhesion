class ChangeAnnotationCoordinatesToFloats < ActiveRecord::Migration[5.2]
  def change
    change_column :annotations, :x, :float
    change_column :annotations, :y, :float
  end
end
