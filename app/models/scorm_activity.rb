class ScormActivity < ActiveRecord::Base
  belongs_to :parent_activity, class_name: "ScormActivity", required: false
  belongs_to :registration
  has_many :scorm_objectives
  has_many :child_activities, class_name: "ScormActivity",
                              foreign_key: "parent_activity_id",
                              dependent: :destroy

  scope :by_latest_attempt, -> { where(latest_attempt: true) }
  scope :by_parents_only, -> { where(parent_activity_id: nil) }
  scope :children_of, ->(id) { where(parent_activity_id: id) }

  def set_to_latest
    self.latest_attempt = true
  end

  def update_with(activity, lms_user_id = nil, lms_user_name = nil)
    self.satisfied = true?(activity[:satisfied])
    self.completed = true?(activity[:completed])
    self.suspended = true?(activity[:suspended])

    # store runtime data
    runtime = activity[:runtime]
    if runtime.present?
      score_scaled = extract_score_scaled(runtime)
      if score_scaled.present?
        self.score_scaled = score_scaled.to_f
      end

      # <timetracked>hours:minutes:seconds.centiseconds</timetracked>
      self.time_tracked = parse_time(extract_time_tracked(runtime))

      # <total_time>hours:minutes:seconds.centiseconds</total_time>
      self.total_time = parse_time(extract_total_time(runtime))

      self.completion_status = extract_completion_status(runtime)
      self.score_raw = extract_score_raw(runtime)
      self.score_min = extract_score_min(runtime)
      self.score_max = extract_score_max(runtime)

      self.success_status = extract_success_status(runtime)
      self.lms_user_id = lms_user_id || runtime[:static][:learner_id].to_i
      self.lms_user_name = lms_user_name || runtime[:static][:learner_name]
    end
  end

  def activity_data(scored_activities, all_activities)
    children_ids = all_activities.select { |act| act.parent_activity_id == id }.map(&:id)
    time = all_attempts_time_tracked_children(scored_activities, all_activities)
    score = score_with_children(scored_activities)
    {
      id: id,
      activity_id: activity_id,
      name: title,
      score: score,
      passed: satisfied? ? "Pass" : "Fail",
      time: time,
      childrenIds: children_ids,
      isParent: !children_ids.empty?,
      parentId: parent_activity_id,
      depth: depth,
    }
  end

  def score_with_children(scored_activities)
    children = scored_activities.select { |act| act.parent_activity_id == id }
    if children.present?
      children_scores = children.map do |act|
        act.score_with_children(scored_activities)
      end
      scores_count = children_scores.compact.count
      if scores_count > 0
        children_scores.compact.sum / scores_count
      end
    else
      score_scaled
    end
  end

  def all_attempts_time_tracked_children(scored_activities, all_activities)
    children = scored_activities.select { |act| act.parent_activity_id == id }
    if children.present?
      children_time = children.map do |act|
        act.all_attempts_time_tracked_children(scored_activities, all_activities)
      end
      children_time.compact.sum
    else
      activity_attempts = all_activities.select do |act|
        act.activity_id == activity_id && act.title == title
      end
      activity_attempts.map(&:time_tracked).compact.sum
    end
  end

  private

  ##
  # parse_time into seconds
  # Adapted from http://stackoverflow.com/a/20818752/1477165
  ##
  def parse_time(duration)
    if duration.present?
      duration.split(":").reverse.map.with_index.sum { |t, i| t.to_f * 60**i }
    end
  end

  def extract_score_raw(runtime)
    if runtime[:score_raw].present?
      runtime[:score_raw].to_f
    elsif runtime[:scoreRaw].present?
      runtime[:scoreRaw].to_f
    end
  end

  def extract_score_min(runtime)
    if runtime[:score_min].present?
      runtime[:score_min].to_f
    elsif runtime[:scoreMin].present?
      runtime[:scoreMin].to_f
    end
  end

  def extract_score_max(runtime)
    if runtime[:score_max].present?
      runtime[:score_max].to_f
    elsif runtime[:scoreMax].present?
      runtime[:scoreMax].to_f
    end
  end

  def extract_completion_status(runtime)
    runtime[:completion_status] || runtime[:completionStatus]
  end

  def extract_time_tracked(runtime)
    runtime[:timetracked] || runtime[:timeTracked]
  end

  def extract_success_status(runtime)
    runtime[:success_status] || runtime[:successStatus]
  end

  def extract_total_time(runtime)
    runtime[:total_time] || runtime[:totalTime]
  end

  def extract_score_scaled(runtime)
    runtime[:score_scaled] || runtime[:scoreScaled]
  end

  def true?(obj)
    obj.to_s == "true"
  end
end
