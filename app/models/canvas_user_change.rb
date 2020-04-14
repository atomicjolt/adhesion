class CanvasUserChange < ApplicationRecord
  validates :admin_making_changes_lms_id, :user_being_changed_lms_id, presence: true

  def self.create_by_diffing_attrs!(
    admin_making_changes_lms_id:,
    user_being_changed_lms_id:,
    original_attrs:,
    new_attrs:,
    failed_attrs: []
  )
    record_attrs = {
      admin_making_changes_lms_id: admin_making_changes_lms_id,
      user_being_changed_lms_id: user_being_changed_lms_id,
      failed_attributes: failed_attrs,
    }

    [:name, :login_id, :sis_user_id, :email].each do |attr|
      next if original_attrs[attr] == new_attrs[attr] || new_attrs[attr].nil?

      record_attrs[attr] = {
        previous_value: original_attrs[attr],
        new_value: new_attrs[attr],
        success: failed_attrs.exclude?(attr),
      }
    end

    if new_attrs[:password].present?
      record_attrs[:password] = {
        previous_value: "[FILTERED]",
        new_value: "[FILTERED]",
        success: failed_attrs.exclude?(:password),
      }
    end

    create!(record_attrs)
  end

  def failed_attributes?
    failed_attributes.present?
  end
  alias_method :failed_attrs?, :failed_attributes?
end
