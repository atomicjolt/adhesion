desc "sets the depth on the courses"
task set_scorm_activity_depth: [:environment] do
  puts "Setting scorm activity depths"
  ApplicationInstance.find_each do |instance|
    Apartment::Tenant.switch(instance.tenant)
    puts "Setting for #{instance.tenant} tenant"
    ScormActivity.find_each do |scorm_activity|
      depth = get_depth(scorm_activity.parent_activity_id)
      scorm_activity.update(depth: depth)
    end
  end
  puts "     DONE!"
end

def get_depth(parent_id, depth = 0)
  if parent_id
    parent = ScormActivity.find_by(id: parent_id)
    depth = get_depth(parent.parent_activity_id, depth + 1) if parent
  end
  depth
end
