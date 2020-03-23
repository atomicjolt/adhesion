class Api::CanvasUsersController < Api::ApiApplicationController
  include Concerns::CanvasSupport

  before_action :validate_token

  def index
    # We're manually constructing the URL here and using `api_get_request` instead of
    # `canvas_api.proxy("LIST_USERS_IN_ACCOUNT", params)` because `proxy("LIST_USERS_IN_ACCOUNT")`
    # doesn't support the `include` param since it's undocumented.
    canvas_url = "accounts/#{params[:canvas_account_id]}/users" \
      "?search_term=#{params[:search_term]}&include[]=email"
    canvas_url += "&page=#{params[:page]}" if params[:page] # You get a 404 if you pass `&page=`

    canvas_response = canvas_api.api_get_request(canvas_url)

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
