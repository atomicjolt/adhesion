class ScormCourse < ActiveRecord::Base
  after_create :set_scorm_course_id

  def set_scorm_course_id
    self.scorm_cloud_id = self.id
    self.save!
  end

end
