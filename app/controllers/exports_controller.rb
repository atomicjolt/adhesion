class ExportsController < ApplicationController
  include Concerns::JwtToken
  include Concerns::CanvasSupport
  before_action :validate_token

  def attendances
    respond_to do |format|
      format.json do
        render json: get_attendances
      end

      format.csv do
        @attendances = get_attendances
        @students = canvas_api.proxy(
          "LIST_USERS_IN_COURSE_USERS",
          {
            course_id: params[:course_id],
            enrollment_type: ["student"],
          },
          request.body.read,
        ).parsed_response
        content_disposition = "attachment; filename=\"attendance.csv\""
        headers["Content-Type"] = "text/csv"
        headers["Content-Disposition"] = content_disposition
      end
    end
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
