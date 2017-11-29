class ExportsController < ApplicationController
  include Concerns::JwtToken
  include Concerns::CanvasSupport
  include AttendanceExportsHelper
  include ExamExportHelper
  before_action :validate_token

  def attendances
    attendances = AttendanceExportsHelper.
      get_attendances(params[:course_id], params[:start_date], params[:end_date])
    if attendances.count > 1000
      render json: { large_file: true }
      tenant = Apartment::Tenant.current
      Apartment::Tenant.switch(Application::PUBLIC_TENANT) do
        AttendanceReportJob.
          perform_later(
            tenant,
            current_application_instance.id,
            current_user.id,
            params[:course_id],
            params[:start_date],
            params[:end_date],
          )
      end
    else
      final_csv = AttendanceExportsHelper.generate_csv(attendances)
      send_data(final_csv)
    end
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
end
