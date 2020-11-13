FactoryBot.define do
  factory :annotation_comment do
    uuid { "" }
    annotation { "" }
    content { "MyText" }
  end
end
