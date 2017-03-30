desc "Fixes all registrations to ensure they have a scorm_course_id"
task fix_scorm_course_ids: [:environment] do
  puts "Fixing registrations with scorm course ids"
  ApplicationInstance.loop_each do |instance|
    puts ""
    puts "Fixing for #{instance.tenant} tenant"
    Registration.find_each do |reg|
      if reg.scorm_course.blank?
        printf "\r  Updating id #{reg.id}"
        reg.lms_course_id = reg.temp_scorm_course.scorm_cloud_id
        reg.save
      end
    end
  end
  puts "     DONE!"
end
