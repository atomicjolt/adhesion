class Api::ImsImportsController < ApplicationController
  include Concerns::CanvasImsccSupport

  def create
    data = params[:data]
    if data.present?
      lti_launches = if data[:lti_launches].present?
                       lti_launches_params(data)[:lti_launches]
                     end

      data = {
        lti_launches: lti_launches,
        context_id: params[:context_id],
        tool_consumer_instance_guid: params[:tool_consumer_instance_guid],
        canvas_course_id: params[:custom_canvas_course_id],
      }

      ImsImportJob.perform_later(data.to_json, current_application_instance, current_user)
    end

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
          :grading_type,
        ],
        config: {},
      ],
    )
  end

end
