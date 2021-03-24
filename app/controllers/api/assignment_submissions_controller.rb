class Api::AssignmentSubmissionsController < Api::ApiApplicationController
  include Concerns::CanvasSupport
  include Concerns::JwtToken

  before_action :validate_token

  def index
    all_submissions = canvas_api.proxy(
      "GET_SINGLE_SUBMISSION_COURSES",
      {
        assignment_id: params[:assignment_id],
        course_id: params[:course_id],
        user_id: params[:user_id],
        include: ["submission_history"],
      },
    )
    if all_submissions.present?
      all_submissions["submission_history"].each do |submission|
        @attachment = submission["attachments"].detect { |h| h["id"] == params[:submission_id].to_i }
        break if @attachment.present?
      end
    end

    if @attachment.present?
      render json: @attachment
    else
      raise Adhesion::Exceptions::AtomicDocsGetAttachment
    end
  end
end
