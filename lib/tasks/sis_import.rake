require "account_populator"

namespace :canvas do
  desc "Set up test course (new course, users, lti-tool)"
  task setup_test_course: [:environment] do
    AccountPopulator.new.setup_test_course
  end
end
