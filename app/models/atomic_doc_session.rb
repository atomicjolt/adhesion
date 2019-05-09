class AtomicDocSession < ApplicationRecord
  belongs_to :atomic_doc

  before_save :ensure_session_id

  private

  def ensure_session_id
    if session_id.blank?
      first = SecureRandom.hex(18)
      second = SecureRandom.hex(99)
      third = SecureRandom.hex(43)
      self.session_id = "#{first}#{second}#{third}"
    end
  end
end
