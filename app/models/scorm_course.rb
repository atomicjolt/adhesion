class ScormCourse < ActiveRecord::Base
  after_create :set_scorm_course_id

  def registrations
    Registration.where(lms_course_id: scorm_cloud_id.to_i)
  end

  def set_scorm_course_id
    course = self
    course.scorm_cloud_id = course.id if course.scorm_cloud_id.blank?
    course.save!
  end

  def course_analytics
    summary = {}
    reg_scores = []
    low_score = nil
    high_score = nil
    passed = 0

    registrations.each do |reg|
      if reg.registration_score
        reg_scores << reg.registration_score
        low_score = reg.registration_score if !low_score ||
            (low_score && reg.registration_score < low_score)
        high_score = reg.registration_score if !high_score ||
            (high_score && reg.registration_score < high_score)
        passed += 1 if reg.passed?
      end
    end

    # Calculate Mean, Median
    mean_score = reg_scores.sum / reg_scores.count if reg_scores.count > 0
    med_score = median(reg_scores.sort)

    # Assemble pass/fail data
    pass_fail = [{ name: "Passed", value: passed },
                 { name: "Incompleted", value: registrations.count - reg_scores.count },
                 { name: "Failed", value: reg_scores.count - passed }]

    summary[:title] = title
    summary[:mean_score] = mean_score
    summary[:med_score] = med_score
    summary[:low_score] = low_score
    summary[:high_score] = high_score
    summary[:registration_count] = registrations.count
    summary[:passed] = pass_fail
    summary
  end

  private

  def median(array)
    return nil if array.empty?
    array = array.sort
    m_pos = array.size / 2
    array.size % 2 == 1 ? array[m_pos] : mean(array[m_pos - 1..m_pos])
  end
end
