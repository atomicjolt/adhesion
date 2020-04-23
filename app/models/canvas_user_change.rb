class CanvasUserChange < ApplicationRecord
  validates :admin_making_changes_lms_id, :user_being_changed_lms_id, presence: true

  # Accepted attrs are :name, :login_id, :sis_user_id and :email.
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
      # We only want to include an attribute in this list if it's changed.
      failed_attributes: failed_attrs.select { |attr| attr_changed?(original_attrs, new_attrs, attr) },
    }

    [:name, :login_id, :sis_user_id, :email].each do |attr|
      next unless attr_changed?(original_attrs, new_attrs, attr)

      record_attrs[attr] = {
        previous_value: original_attrs[attr],
        new_value: new_attrs[attr],
        success: failed_attrs.exclude?(attr),
      }
    end

    create!(record_attrs)
  end

  def failed_attributes?
    failed_attributes.present?
  end
  alias_method :failed_attrs?, :failed_attributes?

  def self.attr_changed?(original_attrs, new_attrs, attr)
    !new_attrs[attr].nil? && new_attrs[attr] != original_attrs[attr]
  end
  private_class_method :attr_changed?
end
