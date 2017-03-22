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

    reg_scores, mean_score, med_score = calc_scores

    passed = registrations.map(&:passed?).compact.count(true)
    complete_count, incomplete_count = calc_complete

    summary[:title] = title
    summary[:scores] = scores(reg_scores, mean_score, med_score)
    summary[:completed] = completed(complete_count, incomplete_count)
    summary[:pass_fail] = pass_fail(reg_scores, passed)
    summary[:nav_buttons] = nav_buttons(complete_count, med_score, passed)
    summary[:analytics_table] = registrations.map(&:registration_data)
    summary
  end

  def course_activities
    summary = {}
    summary[:title] = title
    summary[:analytics_table] = []
    summary
  end

  private

  def scores(reg_scores, mean_score, med_score)
    low_score = reg_scores.first
    high_score = reg_scores.last
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

  def completed(complete_count, incomplete_count)
    [
      { name: "Completed", value: complete_count },
      { name: "Incompleted", value: incomplete_count },
    ]
  end

  def nav_buttons(complete_count, med_score, passed)
    completed_score = 0
    passed_score = 0
    if registrations.count > 0
      completed_score = complete_count.to_f / registrations.count
      passed_score = passed.to_f / registrations.count
    end
    [
      {
        name: "Completed",
        stat: "#{(completed_score * 100).to_i}%",
      },
      {
        name: "Passed",
        stat: "#{(passed_score * 100).to_i}%",
      },
      {
        name: "Average Score",
        stat: "#{(med_score * 100).to_i}%",
      },
      {
        name: "Minutes Per Learner",
        stat: 100,
      },
    ]
  end

  def calc_scores
    reg_scores = registrations.map(&:mean_registration_score).compact.sort
    mean_score = mean(reg_scores) || 0
    med_score = median(reg_scores) || 0

    [reg_scores, mean_score, med_score]
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
