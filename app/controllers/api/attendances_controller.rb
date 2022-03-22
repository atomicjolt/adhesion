class Api::AttendancesController < ApplicationController
  include JwtToken

  protect_from_forgery with: :null_session
  before_action :validate_token

  def students
    filtered_params = params.permit(
      students: [:name, :lms_student_id, :sortable_name],
    )
    filtered_params[:students] || []
  end

  def create
    attendances = []
    Attendance.transaction do
      existing_attendances = Attendance.where(
        lms_course_id: params[:lms_course_id],
        date: params[:date],
        lms_student_id: students.pluck(:lms_student_id),
      )

      # status = PRESENT, LATE, ABSENT, ""
      if params[:status].blank?
        existing_attendances.destroy_all
      else
        existing_attendances.update_all(status: params[:status])
        if existing_attendances.count < students.length
          student_ids = students.pluck(:lms_student_id) - existing_attendances.pluck(:lms_student_id)
          students_to_create = students.select { |student| student_ids.include?(student[:lms_student_id]) }
          existing_and_new_attendances = Attendance.where(
            lms_course_id: params[:lms_course_id],
            date: params[:date],
            status: params[:status],
          ).create(students_to_create)
          attendances = existing_and_new_attendances
        else
          attendances = existing_attendances
        end
      end
    end
    render json: attendances
  end

  def search
    @attendances = Attendance.where(
      lms_course_id: params[:course_id],
      date: params[:date],
    )
    render json: @attendances
  end
end
