class ScormCourse < ActiveRecord::Base
  has_many :registrations,
           foreign_key: :lms_course_id,
           primary_key: :scorm_service_id
  has_one :lti_launch, dependent: :destroy

  scope :complete, -> { where(import_job_status: ScormCourse::COMPLETE) }

  after_commit :set_scorm_service_id, on: [:create]

  attr_accessor :lms_course_id

  CREATED = "CREATED".freeze
  RUNNING = "RUNNING".freeze
  COMPLETE = "COMPLETE".freeze
  FAILED = "FAILED".freeze

  def regs
    @regs ||= registrations.includes(:scorm_activities)
  end

  def set_scorm_service_id
    package_id = "#{id}_#{lms_course_id}"
    self.scorm_service_id = package_id if scorm_service_id.blank?
    save if scorm_service_id_changed?
  end

  def course_analytics
    summary = {}

    reg_scores, mean_score, med_score, time_corr = calc_scores

    passed = regs.map(&:passed?).compact.count(true)
    complete_count, incomplete_count = calc_complete

    summary[:title] = title
    summary[:scores] = scores_statistics(reg_scores, mean_score, med_score, time_corr)
    summary[:correlation_data] = correlation_data
    summary[:completed] = completed(complete_count, incomplete_count)
    summary[:pass_fail] = pass_fail(reg_scores, passed)
    summary[:nav_buttons] = nav_buttons(complete_count, mean_score, passed)
    summary[:analytics_table] = regs.map(&:registration_data)
    summary[:course_time_spent] = course_time_spent
    summary
  end

  def course_activities
    summary = {}
    summary[:title] = title
    summary[:analytics_table] = get_course_activities
    summary
  end

  private

  def get_course_activities
    activities = regs.map(&:activity_data).flatten
    activities.group_by { |a| [a[:activity_id], a[:name]] }.map do |_key, group|
      # group is an array of all the results, grab the first and modify its data
      # based on all the data in the group
      activity = group.first
      group_length = group.length
      # calculate average score
      scores = group.map { |h| h[:score] }.compact
      score = scores.sum / scores.length if scores.present?
      activity[:score] = score
      # calculate average time
      times = group.map { |h| h[:time] }.compact
      time = times.sum / times.length if times.present?
      activity[:time] = time
      # calculate pass or fail
      passed_total = group.map { |x| x[:passed] }
      activity[:passed] = passed_total.count("Pass") >= group_length / 2 ? "Pass" : "Fail"
      activity
    end
  end

  def scores_statistics(reg_scores, mean_score, med_score, time_corr)
    low_score = reg_scores.first
    high_score = reg_scores.last
    coef = (time_corr**2).round(2) unless time_corr == "N/A"
    [
      { name: "Mean Score", value: mean_score },
      { name: "Median Score", value: med_score },
      { name: "Lowest Score", value: low_score },
      { name: "Highest Score", value: high_score },
      { name: "Correlation Coefficient (r)", value: time_corr },
      { name: "Coefficient of Determination (r^2)", value: coef },
    ]
  end

  def correlation_data
    score_time = []
    regs.each do |reg|
      score_time << { time: (reg.registration_time_tracked / 60.0).round(2),
                      score: reg.mean_registration_score }
    end
    score_time
  end

  def course_time_spent
    time_spent = {}
    registrations_time_tracked.each do |time|
      hour = time / 3600
      time_spent[hour] ||= 0
      time_spent[hour] += 1
    end

    times = []
    time_spent.each do |key, value|
      times << { name: key.to_s, students: value }
    end
    times
  end

  def pass_fail(reg_scores, passed)
    incomplete = regs.count - reg_scores.count
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

  def nav_buttons(complete_count, mean_score, passed)
    completed_score = 0
    passed_score = 0
    minutes_per_learner = 0
    if regs.count > 0
      completed_score = complete_count.to_f / regs.count
      passed_score = passed.to_f / regs.count
      minutes_per_learner = mean(registrations_time_tracked) / 60
    end
    [
      {
        type: "complete",
        name: "Complete",
        stat: "#{(completed_score * 100).to_i}%",
      },
      {
        type: "passed",
        name: "Passed",
        stat: "#{(passed_score * 100).to_i}%",
      },
      {
        type: "average_score",
        name: "Average Score",
        stat: "#{(mean_score * 100).to_i}%",
      },
      {
        type: "minutes_per_learner",
        name: "Minutes Per Learner",
        stat: minutes_per_learner,
      },
    ]
  end

  def registrations_time_tracked
    @registrations_time_tracked ||= regs.
      map(&:registration_time_tracked).
      compact.
      sort
  end

  def calc_scores
    reg_scores = regs.map(&:mean_registration_score).compact.sort
    mean_score = mean(reg_scores) || 0
    med_score = median(reg_scores) || 0
    time_corr = calc_correlation(reg_scores, mean_score) || 0

    [reg_scores, mean_score, med_score, time_corr]
  end

  def calc_correlation(scores, mean_score)
    if scores.count < 5
      return "N/A"
    end
    numerator = 0
    sum_time = 0
    sum_score = 0
    times = registrations_time_tracked
    mean_time = mean(times) || 0

    correlation_data.each do |obj|
      numerator += (obj[:time] - mean_time) * (obj[:score] - mean_score)
    end

    times.each do |t|
      sum_time += ((t - mean_time) / 60.0)**2
    end

    scores.each do |s|
      sum_score += (s - mean_score)**2
    end

    (numerator / (sum_time * sum_score)**0.5).round(2)
  end

  def calc_complete
    statuses = regs.map(&:all_completed?)
    complete_count = statuses.count(true)
    incomplete_count = statuses.count(false)
    [complete_count, incomplete_count]
  end

  def mean(array)
    array.sum / array.count if array.count > 0
  end

  def median(array)
    return nil if array.empty?
    sorted = array.sort
    m_pos = sorted.size / 2
    sorted.size % 2 == 1 ? sorted[m_pos] : mean(sorted[m_pos - 1..m_pos])
  end
end
