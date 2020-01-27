class Registration < ActiveRecord::Base
  extend Concerns::EncryptionSupport

  attr_encrypted :scorm_cloud_passback_secret,
                 key: decode_hex(Rails.application.secrets.encryption_key)
  belongs_to :course, required: false
  belongs_to :user, foreign_key: :lms_user_id, primary_key: :lms_user_id
  belongs_to :scorm_course,
             foreign_key: :lms_course_id,
             primary_key: :scorm_service_id
  belongs_to :application_instance
  before_create :set_scorm_cloud_passback_secret
  before_create :set_scorm_registration_id
  has_many :scorm_activities

  def set_scorm_cloud_passback_secret
    self.scorm_cloud_passback_secret = ::SecureRandom::hex(64)
  end

  def set_scorm_registration_id
    self.scorm_registration_id ||= ::SecureRandom::uuid
  end

  def store_activities(activity, parent_id = nil, depth = 0, lms_user_id = nil, lms_user_name = nil)
    # store activity
    is_new = false
    sc_activity = scorm_activities.
      where(
        activity_id: activity[:id],
        title: activity[:title],
        attempts: activity[:attempts],
        depth: depth,
      ).first_or_create { is_new = true }

    if is_new
      # set previous activity to no longer be latest attempt
      scorm_activities.
        where(
          activity_id: activity[:id],
          title: activity[:title],
        ).
        by_latest_attempt.
        update_all(latest_attempt: false)
      sc_activity.set_to_latest
    end

    sc_activity.update_with(activity, lms_user_id, lms_user_name)
    sc_activity.parent_activity_id = parent_id if parent_id
    sc_activity.save!

    children = activity[:children]
    if children.present?
      children = extract_activity(children)
      children.each do |act|
        store_activities(act, sc_activity.id, depth + 1, lms_user_id, lms_user_name)
      end
    end
  end

  def extract_activity(children)
    if children.is_a? Array
      children
    elsif children[:activity].is_a? Array
      children[:activity]
    else
      [children[:activity] || children].compact
    end
  end

  def registration_data
    {
      id: user&.lms_user_id,
      name: user&.name,
      score: mean_registration_score,
      passed: passed? ? "Pass" : "Fail",
      time: registration_time_tracked,
    }
  end

  def activity_data
    @activities ||= get_scorm_activities
  end

  def scorm_activities_count
    @count ||= scorm_activities.count
  end

  def mean_registration_score
    @scores ||= scorm_activities.by_latest_attempt.pluck(:score_scaled).compact
    @scores.sum / @scores.count if @scores.count > 0
  end

  def registration_time_tracked
    @registration_time_tracked ||= scorm_activities.sum(:time_tracked)
  end

  def mean_registration_time_tracked
    registration_time_tracked.to_f / scorm_activities_count.to_f if scorm_activities_count > 0
  end

  def passed?
    @passed ||= scorm_activities.by_latest_attempt.pluck(:success_status).exclude? "Failed"
  end

  def completion_statuses
    @completion_statuses ||= scorm_activities.
      by_latest_attempt.
      by_parents_only.
      map(&:completed).
      compact
  end

  def all_completed?
    @completed ||= completion_statuses.all?
  end

  def scores_statistics(course_scores)
    course_scores << { name: "Selected", value: mean_registration_score }
  end

  private

  def get_scorm_activities
    all_activities = scorm_activities.load
    scored_activities = all_activities.select(&:latest_attempt)
    activities_data = scored_activities.
      map { |act| act.activity_data(scored_activities, all_activities) }
    sort_root_activities(activities_data)
  end

  def sort_root_activities(all_activities)
    new_activities = []
    root_activities = all_activities.select { |act| act[:depth] == 0 }
    root_activities.each do |act|
      new_activities << act
      new_activities << sort_activities(all_activities, act)
    end
    new_activities.flatten
  end

  def sort_activities(all_activities, parent_activity)
    new_activities = []
    children = all_activities.select do |act|
      parent_activity[:childrenIds].include? act[:id]
    end
    children.sort_by! { |act| act[:activity_id] }
    children.each do |act|
      new_activities << act
      new_activities << sort_activities(all_activities, act)
    end
    new_activities.flatten
  end

  def mean_registration_score_percentage
    @mean_registration_score_percentage ||=
      "#{(mean_registration_score.to_f * 100).to_i}%"
  end

  def nav_buttons
    [
      {
        type: "complete",
        name: all_completed? ? "Complete" : "Incomplete",
        stat: "",
      },
      {
        type: "passed",
        name: passed? ? "Passed" : "Failed",
        stat: "",
      },
      {
        type: "average_score",
        name: "Average Score",
        stat: mean_registration_score_percentage,
      },
      {
        type: "total_minutes",
        name: "Total Minutes",
        stat: (registration_time_tracked / 60.0).round(0),
      },
    ]
  end
end
