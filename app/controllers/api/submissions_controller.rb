class Api::SubmissionsController < Api::ApiApplicationController
  include Concerns::CanvasSupport

  def create
    data = submission_params
    PostGradesJob.perform_later(
      data.to_json,
      current_application_instance,
      current_user,
    )

    render json: {}
  end

  def show
    byebug
    1
    submission = canvas_api.proxy("SHOW_USER_DETAILS", { id: params[:id] })
    submission = canvas_api.proxy("LIST_ASSIGNMENT_SUBMISSIONS", { assignment_id: 849, course_id: 230 })
    submission = canvas_api.proxy("GET_A_SINGLE_SUBMISSION", { course_id: 230, assignment_id: 849, user_id: 434, include: ["user", "submission_comments"] })
  end

  private

  def submission_params
    params.
      permit(
        :gradetype,
        :assignment_id,
        sections: [
          :id,
          :sis_section_id,
          :sis_course_id,
        ],
      )
  end
end
