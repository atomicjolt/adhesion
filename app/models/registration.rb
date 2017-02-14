class Registration < ActiveRecord::Base

  attr_encrypted :scorm_cloud_passback_secret, key: Rails.application.secrets.encryption_key
  belongs_to :courses
  belongs_to :users
  belongs_to :lti_application_instance
  belongs_to :scorm_course
  before_create :set_scorm_cloud_passback_secret
  has_many :scorm_activities

  def set_scorm_cloud_passback_secret
    self.scorm_cloud_passback_secret = ::SecureRandom::hex(64)
  end

  def store_activities(activity, parent_id = nil)
    # store activity
    sc_activity = ScormActivity.where(registration_id: id,
                                      title: activity[:title]).first_or_create
    def true?(obj)
      obj.to_s == "true"
    end
    sc_activity.satisfied = true?(activity[:satisfied])
    sc_activity.completed = true?(activity[:completed])
    sc_activity.attempts = activity[:attempts]
    sc_activity.suspended = true?(activity[:suspended])

    # store runtime data
    runtime = activity[:runtime]
    if runtime
      sc_activity.completion_status = runtime[:completion_status]
      sc_activity.score_scaled = runtime[:score_scaled].to_f if runtime[:score_scaled]
      sc_activity.score_raw = runtime[:score_raw].to_f if runtime[:score_raw]
      sc_activity.score_min = runtime[:score_min].to_f if runtime[:score_min]
      sc_activity.score_max = runtime[:score_max].to_f if runtime[:score_max]
      sc_activity.total_time = Time.zone.parse(runtime[:total_time])
      sc_activity.time_tracked = Time.zone.parse(runtime[:time_tracked]) if runtime[:time_tracked]
      sc_activity.success_status = runtime[:success_status]
      sc_activity.lms_user_id = runtime[:static][:learner_id].to_i
      sc_activity.lms_user_name = runtime[:static][:learner_name]
    end
    sc_activity.parent_activity_id = parent_id if parent_id
    sc_activity.save!

    if activity[:children]
      if activity[:children][:activity].class == Array
        activity[:children][:activity].each do |act|
          store_activities(act, sc_activity.id)
        end
      else
        store_activities(activity[:children][:activity], sc_activity.id)
      end
    end
  end

  def registration_score
    scores = []
    scorm_activities.each do |act|
      scores << act.score_scaled if act.score_scaled
    end
    scores.sum / scores.count if scores.count > 0
  end

  def registration_time
    scorm_activites.sum(:total_time)
  end

  def passed?
    !scorm_activities.pluck(:success_status).include? "Failed"
  end
end
