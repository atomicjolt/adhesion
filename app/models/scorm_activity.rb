class ScormActivity < ActiveRecord::Base
  belongs_to :parent_activity, class_name: "ScormActivity"
  belongs_to :registration
  has_many :scorm_objectives
  has_many :child_activities, class_name: "ScormActivity",
                              foreign_key: "parent_activity_id",
                              dependent: :destroy

  scope :by_latest_attempt, -> { where(latest_attempt: true) }
  scope :by_parents_only, -> { where(parent_activity_id: nil) }

  def set_to_latest
    self.latest_attempt = true
  end

  def update_with(activity)
    self.satisfied = true?(activity[:satisfied])
    self.completed = true?(activity[:completed])
    self.suspended = true?(activity[:suspended])

    # store runtime data
    runtime = activity[:runtime]
    if runtime.present?
      if runtime[:score_scaled].present?
        self.score_scaled = runtime[:score_scaled].to_f
      end

      # <timetracked>hours:minutes:seconds.centiseconds</timetracked>
      self.time_tracked = parse_time(runtime[:timetracked])

      # <total_time>hours:minutes:seconds.centiseconds</total_time>
      self.total_time = parse_time(runtime[:total_time])

      self.completion_status = runtime[:completion_status]
      self.score_raw = runtime[:score_raw].to_f if runtime[:score_raw].present?
      self.score_min = runtime[:score_min].to_f if runtime[:score_min].present?
      self.score_max = runtime[:score_max].to_f if runtime[:score_max].present?

      self.success_status = runtime[:success_status]
      self.lms_user_id = runtime[:static][:learner_id].to_i
      self.lms_user_name = runtime[:static][:learner_name]
    end
  end

  def activity_data
    {
      id: id,
      name: title,
      score: score_scaled,
      passed: satisfied? ? "Pass" : "Fail",
      time: total_time,
      isParent: ScormActivity.find_by(parent_activity_id: id).present?,
      depth: get_depth(parent_activity_id),
    }
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

  def true?(obj)
    obj.to_s == "true"
  end

  def get_depth(parent_id, depth = 0)
    if parent_id
      parent = ScormActivity.find_by(id: parent_id)
      depth = get_depth(parent.parent_activity_id, depth + 1) if parent
    end
    depth
  end
end