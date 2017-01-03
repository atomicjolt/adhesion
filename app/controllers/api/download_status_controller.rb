class Api::DownloadStatusController < ApplicationController
  include Concerns::JwtToken
  before_action :validate_token

  # respond_to :json
  respond_to :csv

  def show

    list = AssignedExam.where(course_id: params[:course_id], exam_id: params[:exam_id])

    final_countdown_csv = CSV.generate do |csv|
      csv << ["Name", "Testing Center", "Assigned", "Opened By", "Status"]
      list.each do |l|
        csv << [l.student_name, l.testing_center_id, l.instructor_name, l.opened_by_name, l.status]
      end
    end
    # byebug
    # t=0
    # send_data csv, type: Mime[:csv],
    #    disposition: "attachment; filename=djhg.csv"
    send_data(final_countdown_csv, filename: "asdf")

    # respond_to do |format|
    #   format.csv { render csv: final_countdown_csv, filename: "priorities" }
    # end

  end
end
