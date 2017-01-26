class AddDateAndTimeToExamRequest < ActiveRecord::Migration
  def change
    add_column :exam_requests, :scheduled_date, :date
    add_column :exam_requests, :scheduled_time, :string
    change_column_default :exam_requests, :status, "requested"
  end
end
