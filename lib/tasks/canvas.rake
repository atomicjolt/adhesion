namespace :canvas do
  desc "Sync students with Canvas"
  task :sync_students => [:environment] do |t, args|
    Course.all.each do  |course|
      course.sync_students
    end
  end


# POST /api/v1/accounts/:account_id/courses


# desc "Import course from SIS"
#   task :sis_course_import => [:environment] do |t, args|
#     course_object.each do |new_course|
# =>
#     end
#     Course.all.each do  |course|
#       course.sync_students
#     end
#   end


end

body={
  course[name] =
}