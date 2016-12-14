desc "generates a shared authorization token"
task shared_auth: [:environment] do
  secret = ::SecureRandom::hex(64)
  LtiApplicationInstance.all.each do |instance|
    Apartment::Tenant.switch(instance.lti_key)
    SharedAuth.create(secret: secret)
  end
  puts secret
end
