namespace :canvas do
  desc "Find account id"
  task account_id: [:environment] do
    api = Canvas.new("https://atomicjolt.instructure.com", "#{ENV['CANVAS_TOKEN']}" )
    # accounts = api.all_accounts # gets the accounts
    # accounts_list = []
    # accounts.each do |account|
    #   puts ". #{account['name']}"
    #   accounts_list.push(account)
    # end
    # # api.proxy("LIST_YOUR_COURSES", {}, nil, true) # gets the courses
    # #make the index dynamic to what account they choose.
    # account_id = accounts_list[4]['id']
    account_id = 22


    course_object = [
      {
        name: "imported Course 1",
        course_code: "123456",
        sis_course_id: "sis_course_id_4521"
      }
    ]
    course_object.each do |new_course|
      course = {
        course: {
          name: new_course[:name],
          sis_course_id: new_course[:sis_course_id],
          course_code: new_course[:course_code]
        }
      }

      course = api.proxy("CREATE_NEW_COURSE", {account_id: account_id}, course.to_json)
      puts course
    end
  end

  desc "Import course from SIS"
  task sis_course_import: [:environment] do
    course_object = [
      {
        name: "imported Course 1",
        course_code: "123456",
        start_date: "Tue 06 Dec 2016 18:19:34 GMT", # Course end date in ISO8601 format. e.g. 2011-01-01T01:00Z
        end_date: "Wed 07 Dec 2016 18:19:34 GMT",
        sis_course_id: "sis_course_id_4521"
      }
    ]
    course_object.each do |new_course|
      course = {}
      # nothing is actually required to create a course. But it is recommended that you have the following information.
      course["name"] = new_course[:name]
      course["course_code"] = new_course[:course_code]
      course["start_at"] = new_course[:start_date] # optional
      course["end_at"] = new_course[:end_date] # optional
      course["sis_course_id"] = new_course[:sis_course_id]
      #POST /api/v1/accounts/:account_id/courses
    end
  end

  desc "Import enrollments from SIS"
  task sis_enrollment_import: [:environment] do
    enrollment_object = [
      {
        user_id: "user_id123",
        type: "studentEnrollment"
      }
    ]
    enrollment_object.each do |new_enroll|
      enrollment = {}
      enrollment["user_id"] = new_enroll[:user_id] # required
      enrollment["type"] = new_enroll[:type] # required
      # POST /api/v1/courses/:course_id/enrollments
    end
  end
end
