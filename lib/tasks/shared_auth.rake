desc "generates a shared authorization token"
task shared_auth: [:environment] do
  secret = ::SecureRandom::hex(64)
  SharedAuth.create(secret: secret)
  puts secret
end
