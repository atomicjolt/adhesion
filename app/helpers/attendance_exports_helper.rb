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
end
