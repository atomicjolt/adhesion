class ScormCourse < ActiveRecord::Base
  after_commit :set_scorm_course_id, on: [:create]

  def registrations
    @registrations ||= Registration.
      includes(:scorm_activities).
      where(lms_course_id: scorm_cloud_id.to_i)
  end

  def set_scorm_course_id
    self.scorm_cloud_id = id if scorm_cloud_id.blank?
    save if scorm_cloud_id_changed?
  end

  def course_analytics
    summary = {}

    reg_scores, low_score, high_score = calc_scores
    mean_score = mean(reg_scores)
    med_score = median(reg_scores) || 0
    passed = registrations.map(&:passed?).compact.count(true)

    summary[:title] = title
    summary[:scores] = scores(mean_score, med_score, low_score, high_score)
    summary[:completed] = completed
    summary[:pass_fail] = pass_fail(reg_scores, passed)
    summary[:nav_buttons] = nav_buttons(reg_scores, med_score, passed)
    summary[:analytics_table] = registrations.map(&:registration_data)
    summary
  end

  private

  def scores(mean_score, med_score, low_score, high_score)
    # Calculate Mean, Median
    [
      { name: "Mean Score", value: mean_score },
      { name: "Median Score", value: med_score },
      { name: "Lowest Score", value: low_score },
      { name: "Highest Score", value: high_score },
    ]
  end

  def pass_fail(reg_scores, passed)
    incomplete = registrations.count - reg_scores.count
    [
      { name: "Passed", value: passed },
      { name: "Incompleted", value: incomplete },
      { name: "Failed", value: reg_scores.count - passed },
    ]
  end

  def completed
    complete_count, incomplete_count = calc_complete
    [
      { name: "Completed", value: complete_count },
      { name: "Incompleted", value: incomplete_count },
    ]
  end

  def nav_buttons(reg_scores, med_score, passed)
    [
      {
        name: "Completed",
        stat: (reg_scores.count / registrations.count) * 100,
      },
      {
        name: "Passed",
        stat: (passed / registrations.count) * 100,
      },
      {
        name: "Average Score",
        stat: med_score * 100,
      },
      {
        name: "Minutes Per Learner",
        stat: 100,
      },
    ]
  end

  def calc_scores
    reg_scores = registrations.map(&:mean_registration_score).compact.sort
    low_score = reg_scores.first
    high_score = reg_scores.last

    [reg_scores, low_score, high_score]
  end

  def calc_complete
    statuses = registrations.map(&:all_completed?)
    complete_count = statuses.count(true)
    incomplete_count = statuses.count(false)
    [complete_count, incomplete_count]
  end

  def mean(scores)
    scores.sum / scores.count if scores.count > 0
  end

  def median(scores)
    return nil if scores.empty?
    sorted = scores.sort
    m_pos = sorted.size / 2
    sorted.size % 2 == 1 ? sorted[m_pos] : mean(sorted[m_pos - 1..m_pos])
  end
end
