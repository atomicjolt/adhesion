FactoryBot.define do
  factory :course do
    name { FactoryBot.generate(:name) }
    lms_course_id { generate(:lms_course_id) }
    after(:create) do |course|
      instructor = FactoryBot.create(:user)
      UserCourse.create!(course_id: course.id, user_id: instructor.id, role_id: UserCourse::INSTRUCTOR)
    end
  end
end
