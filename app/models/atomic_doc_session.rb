class AtomicDocSession < ApplicationRecord
  belongs_to :atomic_doc

  before_save :ensure_session_id
  before_save :ensure_expires

  def expired?
    expires_at.to_i <= Time.now.to_i
  end

  private

  def ensure_session_id
    if session_id.blank?
      first = SecureRandom.hex(18)
      second = SecureRandom.hex(99)
      third = SecureRandom.hex(43)
      self.session_id = "#{first}#{second}#{third}"
    end
  end

  def ensure_expires
    if expires_at.blank?
      self.expires_at = 1.day.from_now
    end
  end
end
