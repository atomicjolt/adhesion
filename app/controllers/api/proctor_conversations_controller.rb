class Api::ProctorConversationsController < ApplicationController
  require "httparty"
  include Concerns::CanvasSupport
  include Concerns::JwtToken
  before_action :validate_token
  respond_to :jsons

  # joe proctor 28b9f68f

  def initiate_conversation
    begin
      custom_data_params = {
        ns: "edu.au.exam",
        scope: "/exam/proctor_code",
        user_id: params[:proctor_id],
      }
      @proctor_code = canvas_api.proxy("LOAD_CUSTOM_DATA", custom_data_params).parsed_response["data"]
    rescue LMS::Canvas::InvalidAPIRequestFailedException
      render json: { error: "Unauthorized" }
    end

    headers = {
      "Content-Type" => "application/json",
    }

    body = {
      student_id: params[:student_id],
      proctor_id: params[:proctor_id],
      body: params[:body],
      subject: params[:subject],
      proctor_code: @proctor_code,
    }

    response = HTTParty.post(
      "#{Rails.application.secrets.canvas_url}/proctor_conversations",
      headers: headers,
      body: body.to_json,
      # verify: false,
    )

    render json: response
  end
end
