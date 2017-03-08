class AddUnlockedByIdAndNameToExamRequest < ActiveRecord::Migration
  def change
    add_column :exam_requests, :unlocked_by_id, :integer
    add_column :exam_requests, :unlocked_by_name, :string
  end
end
