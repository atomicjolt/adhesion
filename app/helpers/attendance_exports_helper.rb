module AttendanceExportsHelper
  def self.generate_csv(attendances)
    CSV.generate do |csv|
      days = attendances.group_by(&:date).keys.sort
      header_row = ["Name"].concat days
      csv << header_row

      sorted_students = attendances.sort_by { |s| s.sortable_name.downcase }
      sorted_students = sorted_students.map(&:name).uniq

      sorted_students.each do |student|
        if student.include?(",")
          parts = student.split(",")
          parts = parts.map(&:strip)
          last = parts.shift
          row = [parts.join(" ") << " " << last]
        else
          row = [student]
        end

        days.each do |day|
          att = attendances.detect do |attendance|
            attendance.name == student && attendance.date == day
          end

          row << if att.present? && att.status.present?
                   att.status.downcase
                 else
                   "n/a"
                 end
        end
        csv << row
      end
    end
  end

  def self.get_attendances(lms_course_id, start_date, end_date)
    attendances = Attendance.where(lms_course_id: lms_course_id)
    if start_date.present? && end_date.present?
      attendances = attendances.
        where("date <= ?", Date.parse(end_date)).
        where("date >= ?", Date.parse(start_date))
    end

    attendances
  end
end
