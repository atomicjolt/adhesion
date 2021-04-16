class Api::CourseCompletionsController < Api::ApiApplicationController
  include CanvasSupport

  before_action :check_valid_enrollment

  def check_valid_enrollment
    enrollments = canvas_api.proxy(
      "LIST_ENROLLMENTS_USERS",
      { user_id: current_user.lms_user_id },
      nil,
      true,
    )
    enrollment = enrollments.detect { |enroll| enroll["course_id"] == params[:course_id].to_i } unless enrollments.nil?
    if enrollment.nil? || enrollment["type"] != "StudentEnrollment"
      raise Adhesion::Exceptions::ConcludeEnrollment.new("Can only end student enrollment")
    end
  end

  def complete_enrollment(enrollment)
    canvas_api.proxy(
      "CONCLUDE_DEACTIVATE_OR_DELETE_ENROLLMENT",
      {
        course_id: enrollment["course_id"],
        id: enrollment["id"],
      },
    ).parsed_response
  end

  def create
    enrollments = canvas_api.proxy(
      "LIST_ENROLLMENTS_USERS",
      { user_id: current_user.lms_user_id },
      nil,
      true,
    )
    if enrollments.nil?
      raise Adhesion::Exceptions::ConcludeEnrollment.new
    end
    enrollment = enrollments.detect{ |enroll| enroll["course_id"] == params[:course_id].to_i }

    grades = [{
      sis_user_id: enrollment["sis_user_id"],
      grade: enrollment["grades"]["final_grade"],
      score: enrollment["grades"]["final_score"],
    }]

    response = complete_enrollment(enrollment)

    unless response["enrollment_state"] == "completed"
      raise Adhesion::Exceptions::ConcludeEnrollment.new
    end

    Integrations::SIS.post_grades_to_db(
      enrollment["sis_course_id"],
      enrollment["sis_section_id"],
      SisGrade::FINAL,
      grades,
      enrollment["sis_user_id"],
    )
    render json: { status: 200 }
  end

end
