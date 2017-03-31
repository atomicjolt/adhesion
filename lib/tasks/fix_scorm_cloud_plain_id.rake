desc "Fixes all scorm courses to ensure they have a scorm_cloud_plain_id"
task fix_scorm_cloud_plain_ids: [:environment] do
  puts "Fixing scorm courses scorm_cloud_plain_id"
  ApplicationInstance.find_each do |instance|
    Apartment::Tenant.switch(instance.tenant)
    puts "Fixing for #{instance.tenant} tenant"
    ScormCourse.find_each do |sc|
      if sc.scorm_cloud_plain_id.blank?
        sc.scorm_cloud_plain_id = sc.scorm_service_id.to_i
        sc.save
      end
    end
  end
  puts "     DONE!"
end
