class CanvasUserChange < ApplicationRecord
  validates :admin_making_changes_lms_id, :user_being_changed_lms_id, presence: true
end
