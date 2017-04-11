class Attendance < ActiveRecord::Base
  validates :status,
            inclusion: {
              in: %w(PRESENT LATE ABSENT),
              message: "%{value} is not a valid status",
            }
end
