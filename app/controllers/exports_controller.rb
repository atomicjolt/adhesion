class Api::ExportsController < ApplicationController
  include Concerns::JwtToken

  before_action :validate_token

  def attendance


    respond_to do |format|
      format.json do
        @attendances = Attendance.where(lms_course_id: params[:course_id])
        if(params[:startDate] && params[:endDate])
          @attendances = @attendances.
            where("date < ?", params[:endDate]).
            where("date > ?", params[:startDate])
        end
        render json: @attendances
      end

      format.csv do
        headers['Content-Disposition'] = "attachment; filename=\"search.csv\""
        headers['Content-Type'] ||= 'text/csv'
      end
    end
  end
end
