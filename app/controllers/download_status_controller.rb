class DownloadStatusController < ApplicationController
  include JwtToken
  before_action :validate_token

  def index
    exams_list = AssignedExam.where(course_id: params[:course_id], exam_id: params[:exam_id])

    final_countdown_csv = CSV.generate do |csv|
      csv << [
        "Name",
        "Testing Center",
        "Assigned",
        "Opened By",
        "Status",
      ]
      exams_list.each do |exam|
        csv << [
          exam.student_name,
          exam.testing_center_name,
          exam.instructor_name,
          exam.opened_by_name,
          exam.status,
        ]
      end
    end
    send_data(final_countdown_csv, filename: "export.csv")
  end
end
