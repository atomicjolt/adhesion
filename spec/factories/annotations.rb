FactoryBot.define do
  factory :annotation do
    class_name { "MyString" }
    type { "" }
    uuid { "" }
    annotation { "" }
    page { 1 }
    width { 1.5 }
    height { 1.5 }
    x { 1.5 }
    y { 1.5 }
    size { 1.5 }
    color { "MyString" }
    rectangles { "MyString" }
    lines { "MyString" }
    content { "MyText" }
    document_id { "MyString" }
    submission_id { "MyString" }
  end
end
