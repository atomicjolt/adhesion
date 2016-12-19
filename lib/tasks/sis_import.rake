require "account_populator"

namespace :canvas do
  desc "Set up test course (new course, users, lti-tool)"
  task setup_test_course: [:environment] do
    AccountPopulator.new.setup_test_course
  end

  desc "Get quiz submission objects"
  task get_quiz_submissions: [:environment] do
    api = Canvas.new(
      ENV["APP_DEFAULT_CANVAS_URL"],
      ENV["CANVAS_TOKEN"]
    )

    quizzes = api.proxy("LIST_QUIZZES_IN_COURSE", course_id: 253)
    subs = api.proxy("GET_ALL_QUIZ_SUBMISSIONS", { course_id: 253, quiz_id: 889 })
    # Because there is only one student that has done the quiz
    url = subs["quiz_submissions"][0]["result_url"]
  end

end
