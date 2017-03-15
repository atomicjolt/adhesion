class ScormActivity < ActiveRecord::Base
  belongs_to :parent_activity, class_name: "ScormActivity"
  belongs_to :registration
  has_many :scorm_objectives
  has_many :child_activities, class_name: "ScormActivity",
                              foreign_key: "parent_activity_id",
                              dependent: :destroy

  def update_with(activity)
    self.satisfied = true?(activity[:satisfied])
    self.completed = true?(activity[:completed])
    self.attempts = activity[:attempts]
    self.suspended = true?(activity[:suspended])

    # store runtime data
    runtime = activity[:runtime]
    if runtime
      if runtime[:score_scaled]
        self.score_scaled = runtime[:score_scaled].to_f
      end
      if runtime[:timetracked]
        self.time_tracked = Time.zone.parse(runtime[:timetracked])
      end

      self.completion_status = runtime[:completion_status]
      self.score_raw = runtime[:score_raw].to_f if runtime[:score_raw]
      self.score_min = runtime[:score_min].to_f if runtime[:score_min]
      self.score_max = runtime[:score_max].to_f if runtime[:score_max]
      self.total_time = Time.zone.parse(runtime[:total_time])
      self.success_status = runtime[:success_status]
      self.lms_user_id = runtime[:static][:learner_id].to_i
      self.lms_user_name = runtime[:static][:learner_name]
    end
  end

  private

  def true?(obj)
    obj.to_s == "true"
  end
end
