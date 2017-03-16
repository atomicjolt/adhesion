class Registration < ActiveRecord::Base

  attr_encrypted :scorm_cloud_passback_secret, key: Rails.application.secrets.encryption_key
  belongs_to :courses
  belongs_to :user, foreign_key: :lms_user_id, primary_key: :lms_user_id
  belongs_to :scorm_course
  belongs_to :application_instance
  before_create :set_scorm_cloud_passback_secret
  has_many :scorm_activities

  def set_scorm_cloud_passback_secret
    self.scorm_cloud_passback_secret = ::SecureRandom::hex(64)
  end

  def student_course_analytics
    # return course activity details for user
  end

  def store_activities(activity, parent_id = nil)
    # store activity
    sc_activity = scorm_activities.where(title: activity[:title]).first_or_create
    sc_activity.update_with(activity)
    sc_activity.parent_activity_id = parent_id if parent_id
    sc_activity.save!

    if activity[:children]
      if activity[:children][:activity].is_a? Array
        activity[:children][:activity].each do |act|
          store_activities(act, sc_activity.id)
        end
      else
        store_activities(activity[:children][:activity], sc_activity.id)
      end
    end
  end

  def registration_data
    {
      id: user&.lms_user_id,
      name: user&.name,
      score: registration_score,
      passed: passed? ? "Pass" : "Fail",
      time: registration_time,
    }
  end

  def registration_score
    @scores ||= scorm_activities.pluck(:score_scaled)
    @scores.sum / @scores.count if @scores.count > 0
  end

  def registration_time
    @registration_time ||= scorm_activities.sum(:total_time)
  end

  def passed?
    @passed ||= scorm_activities.pluck(:success_status).exclude? "Failed"
  end
end
