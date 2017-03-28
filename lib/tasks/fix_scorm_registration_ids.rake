desc "Fixes all registrations to ensure they have a scorm_registration_id"
task fix_scorm_registration_ids: [:environment] do
  puts "Fixing registrations"
  ApplicationInstance.find_each do |instance|
    Apartment::Tenant.switch(instance.tenant)
    puts "Fixing for #{instance.tenant} tenant"
    Registration.find_each do |reg|
      reg.scorm_registration_id = reg.id if reg.scorm_registration_id.blank?
      reg.save if reg.scorm_registration_id_changed?
    end
  end
  puts "     DONE!"
end
