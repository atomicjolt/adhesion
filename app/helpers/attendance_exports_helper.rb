module AttendanceExportsHelper
  def self.generate_csv(students, attendances)
    CSV.generate do |csv|
      days = attendances.group_by(&:date).keys.sort
      header_row = ["Name"].concat days
      csv << header_row
      sorted_students = students.sort_by { |s| s["sortable_name"] }
      sorted_students.each do |student|
        if student["name"].include?(",")
          parts = student["name"].split(",")
          parts = parts.map(&:strip)
          last = parts.shift
          row = [parts.join(" ") << " " << last]
        else
          row = [student["name"]]
        end

        days.each do |day|
          att = attendances.detect do |attendance|
            attendance.date == day && student["id"] == attendance.lms_student_id
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
