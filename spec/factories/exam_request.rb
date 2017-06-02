FactoryGirl.define do
  factory :exam_request do
    exam_id { generate(:exam_id) }
    course_id { generate(:course_id) }
    testing_center_name { generate(:testing_center_name) }
    student_id { generate(:student_id) }
    testing_center_id { generate(:testing_center_id) }
    exam_name { generate(:exam_name) }
    student_name { generate(:student_name) }
    course_name { generate(:course_name) }
    message { generate(:message) }
  end
end
