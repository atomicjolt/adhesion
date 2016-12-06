class ExportsController < ApplicationController
  include Concerns::JwtToken
  include Concerns::CanvasSupport
  before_action :validate_token

  def attendances
    @attendances = get_attendances
    @students = canvas_api.proxy(
      "LIST_USERS_IN_COURSE_USERS",
      {
        course_id: params[:course_id],
        enrollment_type: ["student"],
      },
      request.body.read,
    ).parsed_response

    final_csv = CSV.generate do |csv|
      days = @attendances.group_by(&:date).keys.sort
      header_row = ["Name"].concat days
      csv << header_row
      sorted_students = @students.sort_by { |s| s["sortable_name"] }
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
          att = @attendances.detect do |attendance|
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
    send_data(final_csv, filename: "attendance_export")
  end

  private

  def get_attendances
    attendances = Attendance.where(lms_course_id: params[:course_id])
    if params[:startDate] && params[:endDate]
      attendances = attendances.
        where("date <= ?", Date.parse(params[:endDate])).
        where("date >= ?", Date.parse(params[:startDate]))
    end

    attendances
  end
end
