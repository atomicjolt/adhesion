FactoryBot.define do
  factory :atomic_doc do
    url { FactoryBot.generate(:url) }
    status { FactoryBot.generate(:status) }
  end
end
