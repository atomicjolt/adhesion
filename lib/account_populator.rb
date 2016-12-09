require "highline"
require "canvas"

class AccountPopulator
  def cli
    @cli ||= HighLine.new
  end

  def api
    @api ||= Canvas.new(
      ENV["APP_DEFAULT_CANVAS_URL"],
      ENV["CANVAS_TOKEN"]
    )
  end

  def get_account_id
    accounts = api.all_accounts # gets the accounts
    accounts.each_with_index do |account, index|
      puts "#{index}. #{account['name']}"
    end
    # make the index dynamic to what account they choose.
    answer = cli.ask("Install course under which account? ex.. 2", Integer)
    accounts[answer]["id"]
  end

  def create_course(account_id)
    course_name = cli.ask "Name your new course."
    payload = {
      course: {
        name: course_name,
        # sis_course_id: course_id,
      }
    }
    api.proxy(
      "CREATE_NEW_COURSE",
      { account_id: account_id },
      payload.to_json
    )
  end

  def create_users(account_id)
    num_students = cli.ask(
      "How many students do you want in your course?",
      Integer
    )
    (1..num_students).map do
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
      api.proxy(
        "CREATE_USER",
        { account_id: account_id },
        payload.to_json
      ).tap { |stud| puts "#{stud['name']} creating." }
    end
  end

  def enroll_user_in_course(students, course_id)
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
    # Taken from canvas documentation, below.
    # https://canvas.instructure.com/doc/api/external_tools.html
    tools = Lti::Utils.lti_configs
    tools.each_with_index do |tool, index|
      puts "#{index}. #{tool[:app][:lti_key]}"
    end
    tool_index = cli.ask("Which tool do you want to add to your course?", Integer)
    tool = tools[tool_index]
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
