class ScormCourse < ActiveRecord::Base
  after_create :set_scorm_course_id

  def registrations
    Registration.where(lms_course_id: scorm_cloud_id.to_i)
  end

  def set_scorm_course_id
    course = self
    course.scorm_cloud_id = course.id if course.scorm_cloud_id.blank?
    course.save!
  end

  def course_analytics
    summary = {}

    reg_scores = []
    registrations.each do |reg|
      reg_scores << reg.reg_score if reg.reg_score
    end
    mean_score = reg_scores.sum / reg_scores.count if reg_scores.count > 0

    if registrations.first
      summary[:title] = registrations.first.scorm_activities.find_by(
        parent_activity_id: nil
      ).title
    end
    summary[:mean_score] = mean_score
    summary
  end
end
