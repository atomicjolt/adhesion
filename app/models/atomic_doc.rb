class AtomicDoc < ApplicationRecord
  has_many :atomic_doc_sessions, dependent: :destroy

  before_save :ensure_status

  scope :old, -> { where(arel_table[:created_at].lt(8.days.ago)) }

  private

  def ensure_status
    self.status = "queued" if status.blank?
  end
end
