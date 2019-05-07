class AtomicDocSession < ApplicationRecord
  belongs_to :atomic_doc

  before_save :ensure_session_id

  private

  def ensure_session_id
    self.session_id = SecureRandom.hex(19) if session_id.blank?
  end
end
