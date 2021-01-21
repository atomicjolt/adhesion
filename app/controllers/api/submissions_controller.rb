class Api::SubmissionsController < Api::ApiApplicationController
  def create
    data = submission_params
    PostGradesJob.perform_later(
      data.to_json,
      current_application_instance,
      current_user,
    )

    render json: {}
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
