class ExamRequest < ActiveRecord::Base
  scope :by_dates, ->(dates) { where(scheduled_date: dates) }
  scope :by_center_id, ->(center_id) { where(testing_center_id: center_id) }
end
