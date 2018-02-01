FactoryGirl.define do
  sequence :lti_key do |n|
    "lti_key_#{n}"
  end

  sequence :domain do |n|
    "www.example#{n}.com"
  end

  sequence :code do |n|
    "code#{n}"
  end

  sequence :name do |n|
    "user_#{n}"
  end

  sequence :email do |n|
    "user_#{n}@example.com"
  end

  sequence :password do |n|
    "password_#{n}"
  end

  sequence :title do |n|
    "a_title#{n}"
  end

  sequence :abbr do |n|
    "a#{n}"
  end

  sequence :url do |n|
    "http://#{n}.example.com"
  end

  sequence :uri do |n|
    "n#{n}.example.com"
  end

  sequence :description do |n|
    "This is the description: #{n}"
  end

  sequence :locale do |n|
    "a#{n}"
  end

  sequence :address do |n|
    "#{n} West #{n} South"
  end

  sequence :lms_course_id do |n|
    n + 32
  end

  sequence :student_id do |n|
    n + 32
  end

  sequence :testing_center_id do |n|
    n + 64
  end

  sequence :exam_id do |n|
    n + 128
  end

  sequence :course_id do |n|
    n + 256
  end

  sequence :testing_center_name do |n|
    "testing_center_#{n}"
  end

  sequence :exam_name do |n|
    "exame_name_#{n}"
  end

  sequence :student_name do |n|
    "student_name_#{n}"
  end

  sequence :course_name do |n|
    "course_name_#{n}"
  end

  sequence :message do |n|
    "Ima Message#{n}"
  end

  sequence :scorm_service_id do |n|
    "#{n}_#{n + 12}"
  end

  sequence :lms_assignment_id do |n|
    n + 512
  end

  sequence :gradetype do
    [SisGrade::MIDTERM, SisGrade::FINAL].sample
  end

  sequence :sis_course_id do |n|
    "abc123_#{n}"
  end

  sequence :sis_section_id do |n|
    "def456_#{n}"
  end

  sequence :sis_user_id do |n|
    "meh789_#{n}"
  end

  sequence :common_grade do
    ["100.0", "97.2", "95.8", "92.1", "90.6", "87.0", "85.1", "82.9", "80.3", "77.0", "75.8", "72.3", "67.2"].sample
  end
end
