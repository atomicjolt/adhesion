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
    summary = {}

    summary[:title] = "Scorm Title"
    summary[:mean_score] = mean_registration_score
    summary[:pass_fail] = pass_fail
    summary[:nav_buttons] = nav_buttons
    summary[:analytics_table] = []
    summary
  end

  def store_activities(activity, parent_id = nil)
    # store activity

    sc_activity = scorm_activities.
      where(activity_id: activity[:id], title: activity[:title]).
      first_or_create

    sc_activity.update_with(activity)
    sc_activity.parent_activity_id = parent_id if parent_id
    sc_activity.save!

    children = activity[:children]
    if children.present?
      if children[:activity].is_a? Array
        children[:activity].each do |act|
          store_activities(act, sc_activity.id)
        end
      else
        store_activities(children[:activity], sc_activity.id)
      end
    end
  end

  def registration_data
    {
      id: user&.lms_user_id,
      name: user&.name,
      score: mean_registration_score,
      passed: passed? ? "Pass" : "Fail",
      time: mean_registration_total_time,
    }
  end

  def scorm_activities_count
    @count ||= scorm_activities.count
  end

  def mean_registration_score
    @scores ||= scorm_activities.pluck(:score_scaled).compact
    @scores.sum / @scores.count if @scores.count > 0
  end

  def registration_total_time
    @registration_total_time ||= scorm_activities.sum(:total_time)
  end

  def mean_registration_total_time
    registration_total_time / scorm_activities_count if scorm_activities_count > 0
  end

  def passed?
    @passed ||= scorm_activities.pluck(:success_status).exclude? "Failed"
  end

  def completion_statuses
    @completion_statuses ||= scorm_activities.map(&:completion_status).compact
  end

  def all_completed?
    @completed ||= completion_statuses.all? { |status| status == "completed" }
  end

  private

  def pass_fail
    [
      { name: "Passed", value: passed? },
      { name: "Incompleted", value: passed? },
      { name: "Failed", value: passed? },
    ]
  end

  def nav_buttons
    [
      {
        name: "Completed",
        stat: 100,
      },
      {
        name: passed? ? "Passed" : "Failed",
        stat: 100,
      },
      {
        name: "Average Score",
        stat: 80,
      },
      {
        name: "Total Minutes",
        stat: 100,
      },
    ]
  end
end
