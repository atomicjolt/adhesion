FactoryBot.define do
  factory :atomic_doc_session do
    session_id { FactoryBot.generate(:token) }
    atomic_doc
  end
end
