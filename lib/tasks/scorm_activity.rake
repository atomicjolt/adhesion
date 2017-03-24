desc "sets the depth on the courses"
task set_scorm_activity_depth: [:environment] do
  ScormActivity.find_each do |scorm_activity|
    depth = get_depth(scorm_activity.parent_activity_id)
    scorm_activity.update_attributes(depth: depth)
  end
end

def get_depth(parent_id, depth = 0)
  if parent_id
    parent = ScormActivity.find_by(id: parent_id)
    depth = get_depth(parent.parent_activity_id, depth + 1) if parent
  end
  depth
end
