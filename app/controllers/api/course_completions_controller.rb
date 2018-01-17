class Api::CourseCompletionsController < Api::ApiApplicationController
  include Concerns::CanvasSupport

  def create
    enrollments = canvas_api.proxy(
      "LIST_ENROLLMENTS_USERS",
      { user_id: current_user.lms_user_id },
    ).parsed_response
    enrollment = enrollments.detect{ |enroll| enroll["course_id"] == params[:course_id].to_i }

    grades = [{
      sis_user_id: enrollment["sis_user_id"],
      grade: enrollment["grades"]["final_score"],
    }]

    Integrations::U4sm.post_grades_to_db(
      enrollment["sis_course_id"],
      enrollment["sis_section_id"],
      "final",
      grades,
    )
    render json: { status: 200 }
  end

end
