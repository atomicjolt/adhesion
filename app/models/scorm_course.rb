class ScormCourse < ActiveRecord::Base
  after_create :set_scorm_course_id

  def set_scorm_course_id
    course = self
    course.scorm_cloud_id = course.id if course.scorm_cloud_id.blank?
    course.save!
  end
end
