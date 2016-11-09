FactoryGirl.define do

  factory :user do
    name { FactoryGirl.generate(:name) }
    email { FactoryGirl.generate(:email) }
    password { FactoryGirl.generate(:password) }
    after(:build) { |user| user.confirm }
    after(:create) { |user|
      FactoryGirl.create(:authentication, user_id: user.id, provider_url: FactoryGirl.generate(:domain))
    }
  end

end
