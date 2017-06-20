class Api::AttendancesController < ApplicationController
  include Concerns::JwtToken

  protect_from_forgery with: :null_session
  before_action :validate_token

  def attendance_params(student, params)
    {
      name: student[:name],
      sortable_name: student[:sortable_name],
      lms_student_id: student[:lms_student_id],
      lms_course_id: params[:lms_course_id],
      date: params[:date],
      status: params[:status],
    }
  end

  def students
    filtered_params = params.permit(
      students: [:name, :lms_student_id, :sortable_name],
    )
    filtered_params[:students] || []
  end

  def create
    attendances = []
    Attendance.transaction do
      students.each do |student|
        att_params = attendance_params(student, params)

        attendance = Attendance.where(
          lms_student_id: att_params[:lms_student_id],
          lms_course_id: att_params[:lms_course_id],
          date: att_params[:date],
        ).first_or_create

        # status = PRESENT, LATE, ABSENT
        if att_params[:status].blank?
          attendance.destroy
        else
          attendance.update(att_params)
        end
        attendances << attendance unless attendance.destroyed?
      end
    end
    render json: attendances
  end

  def search
    @attendances = Attendance.where(
      date: params[:date],
      lms_course_id: params[:course_id],
    )
    render json: @attendances
  end
end
