class Api::CanvasUsersController < Api::ApiApplicationController
  include Concerns::CanvasSupport

  before_action :validate_token

  def index
    canvas_response = canvas_api.proxy(
      "LIST_USERS_IN_ACCOUNT",
      {
        account_id: params[:canvas_account_id],
        search_term: params[:search_term],
        page: params[:page],
      },
    )

    render(
      json: {
        matching_users: canvas_response.parsed_response,
        previous_page_available: previous_page_available?(canvas_response),
        next_page_available: next_page_available?(canvas_response),
      },
      status: :ok,
    )
  end
end
