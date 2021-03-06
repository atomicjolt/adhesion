class AtomicDoc < ApplicationRecord
  has_many :atomic_doc_sessions, dependent: :destroy

  before_save :ensure_status

  private

  def ensure_status
    self.status = "queued" if status.blank?
  end
end
