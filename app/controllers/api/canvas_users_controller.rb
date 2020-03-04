class Api::CanvasUsersController < ApplicationController
  include Concerns::CanvasSupport

  def index
    canvas_response = canvas_api.proxy(
      "LIST_USERS_IN_ACCOUNT",
      { account_id: params[:canvas_account_id], search_term: params[:search_term] },
    )

    render json: canvas_response.parsed_response, status: :ok
  end
end
