FactoryGirl.define do
  factory :attendance do
    lms_student_id { 1 }
    lms_course_id { 1 }
    date { Date.today }
    status { "PRESENT" }
    sortable_name { FactoryGirl.generate(:name) }
  end
end
