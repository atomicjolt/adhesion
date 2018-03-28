FactoryBot.define do
  factory :registration do
    lms_course_id { 1 }
    lms_user_id { 1 }
    created_at { Date.parse("2016-12-08") }
    status { "PRESENT" }
    score { 1 }
    application_instance_id { 1 }
    scorm_registration_id { 1 }
  end
end
