require "highline"

namespace :canvas do
  desc "Set up test course (new course, users, lti-tool)"
  task setup_test_course: [:environment] do
    account_id = get_account_id
    course_id = create_course(account_id)["id"]
    students = create_users(account_id)
    enroll_user_in_course(students, course_id)
    install_lti_tool_to_course(course_id)
  end

  def get_account_id
    cli = HighLine.new
    api = Canvas.new(
      "https://atomicjolt.instructure.com",
      "#{ENV['CANVAS_TOKEN']}"
    )
    accounts_list = []
    accounts = api.all_accounts # gets the accounts
    accounts.each_with_index do |account, index|
      puts "#{index}. #{account['name']}"
      accounts_list.push(account)
    end
    # make the index dynamic to what account they choose.
    answer = cli.ask "Install course under which account? ex.. 2"
    accounts_list[answer.to_i]["id"]
  end

  def create_course(account_id)
    cli = HighLine.new
    api = Canvas.new(
      "https://atomicjolt.instructure.com",
      "#{ENV['CANVAS_TOKEN']}"
    )
    course_name = cli.ask "Name your new course."
    payload = {
      course: {
        name: course_name,
        # sis_course_id: new_course[:sis_course_id],
        # course_code: new_course[:course_code]
      }
    }
    api.proxy(
      "CREATE_NEW_COURSE",
      { account_id: account_id },
      payload.to_json
    )
  end

  def create_users(account_id)
    cli = HighLine.new
    api = Canvas.new(
      "https://atomicjolt.instructure.com",
      "#{ENV['CANVAS_TOKEN']}"
    )
    num_students = cli.ask "How many students do you want in your course?"
    new_students = []
    num_students.to_i.times do
      user_first_name = Faker::Name.first_name
      user_last_name = Faker::Name.last_name
      payload = {
        user: {
          name: "#{user_first_name} #{user_last_name}",
          short_name: user_first_name,
          sortable_name: "#{user_last_name}, #{user_first_name}",
          terms_of_use: true,
          skip_registration: true,
          avatar: {
            url: Faker::Avatar.image
          }
        },
        pseudonym: {
          unique_id: Faker::Internet.safe_email,
          password: "asdfasdf"
        }
      }

      stud = api.proxy(
        "CREATE_USER",
        { account_id: account_id },
        payload.to_json
      )
      puts "#{stud['name']} created."
      new_students.push(stud)
    end
    new_students
  end

  def enroll_user_in_course(students, course_id)
    api = Canvas.new(
      "https://atomicjolt.instructure.com",
      "#{ENV['CANVAS_TOKEN']}"
    )
    students.each do |student|
      payload = {
        enrollment: {
          user_id: student["id"],
          type: "StudentEnrollment",
          enrollment_state: "active"
        }
      }
      api.proxy(
        "ENROLL_USER_COURSES",
        { course_id: course_id },
        payload.to_json
      )
      puts "Enrolled #{student['name']} into your course_id #{course_id}"
    end
  end

  def install_lti_tool_to_course(course_id)
    api = Canvas.new(
      "https://atomicjolt.instructure.com",
      "#{ENV['CANVAS_TOKEN']}"
    )
    # https://canvas.instructure.com/doc/api/external_tools.html
    cli = HighLine.new
    tools = Lti::Utils.lti_configs
    tools.each_with_index do |tool, index|
      puts "#{index}. #{tool[:app][:lti_key]}"
    end
    tool_index = cli.ask "Which tool do you want to add to your course?"
    tool = tools[tool_index.to_i]
    payload = {
      name: "#{tool[:app][:lti_key]}",
      privacy_level: "public",
      consumer_key: "#{tool[:app][:lti_key]}",
      shared_secret: "#{tool[:app][:lti_secret]}",
      config_type: "by_xml",
      config_xml: "#{tool[:config]}"
    }
    api.proxy(
      "CREATE_EXTERNAL_TOOL_COURSES",
      { course_id: course_id },
      payload.to_json
    )
  end
end
