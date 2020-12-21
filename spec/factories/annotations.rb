FactoryBot.define do
  factory :annotation do
    document_id { "00000000-0000-0000-0000-000000000000" }
    annotation_type { "area" }
    color { "FF0000" }
    page { 1 }
    rectangles { [{ height: 75, width: 150, x: 19, y: 37 }] }
  end
end
