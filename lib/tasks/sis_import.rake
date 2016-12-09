require "account_populator"

namespace :canvas do
  desc "Set up test course (new course, users, lti-tool)"
  task setup_test_course: [:environment] do
    helper = AccountPopulator.new
    account_id = helper.get_account_id
    course_id = helper.create_course(account_id)["id"]
    students = helper.create_users(account_id)
    helper.enroll_user_in_course(students, course_id)
    helper.install_lti_tool_to_course(course_id)
  end
end
