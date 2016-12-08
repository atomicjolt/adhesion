class ExportsController < ApplicationController
  include Concerns::JwtToken
  include Concerns::CanvasSupport
  include AttendanceExportsHelper
  before_action :validate_token

  def attendances
    attendances = get_attendances
    students = canvas_api.proxy(
      "LIST_USERS_IN_COURSE_USERS",
      {
        course_id: params[:course_id],
        enrollment_type: ["student"],
      },
      request.body.read,
    ).parsed_response

    final_csv = AttendanceExportsHelper.generate_csv(students, attendances)
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
