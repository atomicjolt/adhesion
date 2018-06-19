FactoryBot.define do
  factory :attendance do
    lms_student_id { 1 }
    lms_course_id { 1 }
    date { Date.parse("2016-12-08") }
    status { "PRESENT" }
    sortable_name { FactoryBot.generate(:name) }
    name { FactoryBot.generate(:name) }
  end
end
