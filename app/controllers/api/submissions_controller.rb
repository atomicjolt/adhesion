class Api::SubmissionsController < Api::ApiApplicationController
  include Concerns::CanvasSupport
  include Concerns::JwtToken

  before_action :validate_token

  def index
    submission = canvas_api.proxy(
      "GET_SINGLE_SUBMISSION_COURSES",
      {
        assignment_id: params[:assignment_id],
        course_id: params[:course_id],
        user_id: params[:user_id],
      },
    )
    attachment = submission["attachments"].detect { |h| h["id"] == params[:submission_id].to_i }
    if attachment.nil?
      raise Adhesion::Exceptions::DocviewerGetAttachment
    end

    # This just returns the url to the submission which PDFJS is able to render
    # In the future we will want to send the binary data back for converted file types as shown below:
    # @file = open(attachment["url"]).read
    # send_data @file, filename: attachment["display_name"]
    render json: attachment
  end
end
