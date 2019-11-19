class ApiToken < ApplicationRecord
  attr_encrypted :token, key: Rails.application.secrets.encryption_key, mode: :per_attribute_iv_and_salt

  before_save :ensure_token

  validates :name, presence: true

  private

  def ensure_token
    self.token = Devise.friendly_token(64) if token.blank?
  end
end
