class Authentication < ApplicationRecord
  extend EncryptionSupport

  has_secure_token :id_token

  attr_encrypted :token,
                 key: decode_hex(Rails.application.secrets.encryption_key),
                 mode: :per_attribute_iv_and_salt
  attr_encrypted :secret,
                 key: decode_hex(Rails.application.secrets.encryption_key),
                 mode: :per_attribute_iv_and_salt
  attr_encrypted :refresh_token,
                 key: decode_hex(Rails.application.secrets.encryption_key),
                 mode: :per_attribute_iv_and_salt

  belongs_to :user, inverse_of: :authentications
  belongs_to :application_instance, inverse_of: :authentications, required: false
  belongs_to :course, inverse_of: :authentications, required: false

  validates :provider,
            presence: true,
            uniqueness: {
              scope: %i[
                uid
                user_id
                application_instance_id
                course_id
                provider_url
              ],
            }

  def copy_to_tenant(application_instance, user)
    Apartment::Tenant.switch(application_instance.tenant) do
      authentication = user.authentications.find_or_initialize_by(
        uid: attributes["uid"],
        provider: attributes["provider"],
        provider_url: attributes["provider_url"],
      )
      authentication.update(tenant_copy_attributes)
      authentication
    end
  end

  def tenant_copy_attributes
    attributes.except(
      "id",
      "created_at",
      "updated_at",
      "user_id",
      "application_instance_id",
      "course_id",
    )
  end

  # Find an authentication using an auth object provided by omniauth
  def self.for_auth(auth)
    provider_url = UrlHelper.scheme_host_port(auth["info"]["url"])
    Authentication.find_by(
      uid: auth["uid"].to_s,
      provider: auth["provider"],
      provider_url: provider_url,
    )
  end

  # Build an authentication using an auth object provided by omniauth
  def self.authentication_attrs_from_auth(auth)
    raw_info = auth["extra"]["raw_info"] || {}
    info = auth["info"] || {}
    provider_url = UrlHelper.scheme_host_port(info["url"])
    attributes = {
      uid: auth["uid"].to_s,
      username: info["nickname"],
      provider: auth["provider"],
      provider_url: provider_url,
      lti_user_id: raw_info["lti_user_id"],
    }
    if credentials = auth["credentials"]
      attributes[:token] = credentials["token"]
      attributes[:secret] = credentials["secret"]
      attributes[:refresh_token] = credentials["refresh_token"] if credentials["refresh_token"]
    end
    attributes
  end

end
