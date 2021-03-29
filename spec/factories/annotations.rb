FactoryBot.define do
  factory :annotation do
    user
    document_id { "1234" }
    annotation_type { "area" }
    color { "FF0000" }
    page { 1 }
    rectangles { [{ height: 75, width: 150, x: 19, y: 37 }] }
  end
end
