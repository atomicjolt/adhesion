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

    users = registrations.map(&:registration_data)

    reg_scores, low_score, high_score, passed = calc_scores(registrations)

    # Calculate Mean, Median
    mean_score = mean(reg_scores)
    med_score = median(reg_scores) || 0

    incomplete = registrations.count - reg_scores.count

    summary[:title] = title
    summary[:scores] = [
      { name: "Mean Score", value: mean_score },
      { name: "Median Score", value: med_score },
      { name: "Lowest Score", value: low_score },
      { name: "Highest Score", value: high_score },
    ]
    summary[:pass_fail] = [
      { name: "Passed", value: passed },
      { name: "Incompleted", value: incomplete },
      { name: "Failed", value: reg_scores.count - passed },
    ]
    summary[:nav_buttons] = [
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
    summary[:analytics_table] = users
    summary
  end

  private

  def calc_scores(registrations)
    reg_scores = registrations.map(&:mean_registration_score).compact.sort
    low_score = reg_scores.first
    high_score = reg_scores.last
    # get array of passing and failing registrations, then reject false values
    passed = registrations.map(&:passed?).compact.count(true)

    [reg_scores, low_score, high_score, passed]
  end

  def calc_complete(registrations)
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
