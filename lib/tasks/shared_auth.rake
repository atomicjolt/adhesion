desc "generates a shared authorization token"
task shared_auth: [:environment] do
  secret = ::SecureRandom::hex(64)
  ApplicationInstance.all.each do |instance|
    Apartment::Tenant.switch(instance.tenant)
    SharedAuth.create(secret: secret)
  end
  puts secret
end
