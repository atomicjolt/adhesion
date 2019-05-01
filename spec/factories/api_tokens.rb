FactoryBot.define do
  factory :api_token do
    name { "A Name" }
    token { "SecretToken" }
  end
end
