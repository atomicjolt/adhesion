FactoryBot.define do
  factory :api_token do
    name { FactoryBot.generate(:name) }
    token { FactoryBot.generate(:token) }
  end
end
