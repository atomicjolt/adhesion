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

  def update
    edit_user_response = edit_user_on_canvas

    # This ID is the ID of the login record; it's different from the user's login ID.
    numeric_login_id = find_canvas_user_login["id"]

    edit_user_login_response = edit_user_login_on_canvas(numeric_login_id)

    render(
      json: {
        id: params[:id],
        name: edit_user_response["name"],
        login_id: edit_user_login_response["unique_id"],
        sis_user_id: edit_user_login_response["sis_user_id"],
        email: edit_user_response["email"],
      },
      status: :ok,
    )
  end

  private

  def edit_user_on_canvas
    canvas_api.api_put_request(
      "users/#{params[:id]}",
      "user[name]" => params[:user][:name],
      "user[email]" => params[:user][:email],
    )
  end

  def find_canvas_user_login
    list_user_logins_response = canvas_api.proxy(
      "LIST_USER_LOGINS_USERS",
      user_id: params[:id],
    )

    list_user_logins_response.detect do |login|
      login["unique_id"] == params[:original_user_login_id]
    end
  end

  def edit_user_login_on_canvas(numeric_login_id)
    canvas_api.api_put_request(
      "accounts/#{params[:canvas_account_id]}/logins/#{numeric_login_id}",
      "login[unique_id]" => params[:user][:login_id],
      "login[sis_user_id]" => params[:user][:sis_user_id],
      "login[password]" => params[:user][:password],
    )
  end
end
