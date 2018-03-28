FactoryBot.define do
  factory :scorm_course do
    title { generate(:title) }
    scorm_service_id { generate(:scorm_service_id) }
    lms_assignment_id { generate(:lms_assignment_id) }
  end
end
