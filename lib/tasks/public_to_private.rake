desc "Mark public courses private"
task :public_to_private, %i(api_token canvas_domain public_course_csv) => [:environment] do |_t, args|
  CSV.foreach(args[:public_course_csv]) do |row|
    id = row[0]
    if id != "id"
      RestClient.put(
        "#{args[:canvas_domain]}/api/v1/courses/#{id}",
        {
          course: {
            is_public: false,
            is_public_to_auth_users: false,
            public_syllabus: false,
            public_syllabus_to_auth: false,
          },
        },
        {
          Authorization: "Bearer #{args[:api_token]}",
        },
      )
      puts "updated course #{id}, #{row[3]}"
    end
  end
end
