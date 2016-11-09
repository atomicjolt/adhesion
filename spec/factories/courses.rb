FactoryGirl.define do

  factory :course do
    name { FactoryGirl.generate(:name) }
    after(:create) do |course|
      instructor = FactoryGirl.create(:user)
      UserCourse.create!(course_id: course.id, user_id: instructor.id, role_id: UserCourse::INSTRUCTOR)
    end
  end

end