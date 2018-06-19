class Api::ImsImportsController < ApplicationController
  include Concerns::CanvasImsccSupport

  def create
    lti_launches = lti_launches_params(params[:data])[:lti_launches]

    data = {
      lti_launches: lti_launches,
      context_id: params[:context_id],
      tool_consumer_instance_guid: params[:tool_consumer_instance_guid],
      canvas_course_id: params[:custom_canvas_course_id],
    }

    ImsImportJob.perform_later(data.to_json, current_application_instance, current_user)

    render json: { status: "completed" }
  end

  private

  def lti_launches_params(current_params)
    current_params.permit(
      lti_launches: [
        :token,
        scorm_course: [
          "$canvas_assignment_id",
          "$canvas_attachment_id",
          :points_possible,
          :title,
        ],
        config: {},
      ],
    )
  end

end
