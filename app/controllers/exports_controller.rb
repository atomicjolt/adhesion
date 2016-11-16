class ExportsController < ApplicationController
  include Concerns::JwtToken

  before_action :validate_token

  def attendances


    respond_to do |format|
      format.json do
        render json: get_attendances
      end

      format.csv do
        @attendances = get_attendances
        
        headers['Content-Type'] = "text/csv"
        headers['Content-Disposition'] = "attachment; filename=\"attendance.csv\""
      end
    end
  end

  private

  def get_attendances
    attendances = Attendance.where(lms_course_id: params[:course_id])
    if(params[:startDate] && params[:endDate])
      attendances = attendances.
        where("date <= ?", Date.parse(params[:endDate])).
        where("date >= ?", Date.parse(params[:startDate]))
    end

    attendances
  end
end
