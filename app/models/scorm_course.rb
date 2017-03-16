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
    med_score = median(reg_scores)

    # Assemble pass/fail data
    pass_fail = [
      { name: "Passed", value: passed },
      { name: "Incompleted", value: registrations.count - reg_scores.count },
      { name: "Failed", value: reg_scores.count - passed },
    ]

    summary[:title] = title
    summary[:mean_score] = mean_score
    summary[:med_score] = med_score
    summary[:low_score] = low_score
    summary[:high_score] = high_score
    summary[:registration_count] = registrations.count
    summary[:passed] = pass_fail
    summary[:analytics_table] = users
    summary
  end

  private

  def calc_scores(registrations)
    reg_scores = registrations.map(&:mean_registration_score).compact.sort
    low_score = reg_scores.first
    high_score = reg_scores.last
    passed = registrations.map(&:passed?).compact.count

    [reg_scores, low_score, high_score, passed]
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
