class ExportsController < ApplicationController
  include Concerns::JwtToken
  include Concerns::CanvasSupport
  include AttendanceExportsHelper
  include ExamExportHelper
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
    send_data(final_csv)
  end

  def export_exams_as_csv
    export = ExamExportHelper.generate_csv(exams)
    send_data(export)
  end

  private

  def exams
    ExamRequest.
      by_dates(params[:start]..params[:end]).
      by_center_id(params[:testing_centers_account_id])
  end

  def get_attendances
    attendances = Attendance.where(lms_course_id: params[:course_id])
    if params[:startDate].present? && params[:endDate].present?
      attendances = attendances.
        where("date <= ?", Date.parse(params[:endDate])).
        where("date >= ?", Date.parse(params[:startDate]))
    end

    attendances
  end
end
