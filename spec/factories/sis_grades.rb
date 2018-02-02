FactoryGirl.define do
  factory :sis_grade do
    sis_course_id { generate(:sis_course_id) }
    sis_section_id { generate(:sis_section_id) }
    gradetype { generate(:gradetype) }
    grades []
  end
end
