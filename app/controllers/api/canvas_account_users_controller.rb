class Api::CanvasAccountUsersController < Api::ApiApplicationController
  include Concerns::CanvasSupport

  before_action :validate_token
  before_action :validate_current_user_lti_admin
  before_action :fetch_original_user, only: [:update]
  before_action :validate_user_being_changed_is_in_account, only: [:update]
  before_action :validate_user_being_changed_is_not_admin, only: [:update]

  # This action only lists users who are members of the Canvas account given in the LTI launch.
  # Users from sub-accounts of that account are also included.
  def index
    canvas_response = search_for_users_on_canvas(params[:search_term], params[:page])

    render(
      json: {
        matching_users: canvas_response.parsed_response,
        previous_page_available: previous_page_available?(canvas_response),
        next_page_available: next_page_available?(canvas_response),
      },
      status: :ok,
    )
  end

  # This action only shows users who are members of the Canvas account given in the LTI launch.
  # Users from sub-accounts of that account are also shown.
  # This action shows additional user information that is not included in the index action response.
  def show
    user = search_for_users_on_canvas(params[:id]).first

    user[:is_account_admin] = user_being_changed_is_account_admin?

    render(json: user, status: :ok)
  end

  # This action can only update users who are members of the Canvas account given in the LTI launch.
  # Users from sub-accounts of that account can also be updated.
  def update
    pending_attrs = [:name, :email, :login_id, :sis_user_id]

    begin
      edit_user_response = edit_user_on_canvas
      pending_attrs = [:login_id, :sis_user_id] # We updated name and email.
    rescue LMS::Canvas::CanvasException => e
      render_update_user_exception(:edit_user, e)
      return
    end

    begin
      # This ID is the ID of the login record; it's different from the user's login ID.
      numeric_login_id = find_canvas_user_login["id"]
      edit_user_login_response = edit_user_login_on_canvas(numeric_login_id)
      pending_attrs = [] # We updated login_id and sis_user_id.
    rescue LMS::Canvas::CanvasException => e
      render_update_user_exception(:edit_user_login, e)
      return
    end

    render(
      json: {
        id: params[:id],
        name: edit_user_response["name"],
        login_id: edit_user_login_response["unique_id"],
        sis_user_id: edit_user_login_response["sis_user_id"],
        email: edit_user_response["email"],
        is_account_admin: user_being_changed_is_account_admin?,
      },
      status: :ok,
    )
  ensure
    log_user_change(failed_attrs: pending_attrs)
  end

  private

  def validate_current_user_lti_admin
    unless current_user.lti_admin?(jwt_context_id)
      user_not_authorized "Only account admins are authorized to use this application."
    end
  end

  def fetch_original_user
    original_user = search_for_users_on_canvas(params[:id]).first

    @original_user = HashWithIndifferentAccess.new(original_user)
  end

  def validate_user_being_changed_is_in_account
    user_is_in_account = @original_user.present?

    unless user_is_in_account
      user_not_authorized(
        "You are only authorized to modify users from the account or sub-accounts you administer.",
      )
    end
  end

  def validate_user_being_changed_is_not_admin
    if user_being_changed_is_account_admin?
      user_not_authorized(
        "The user you are trying to update has an admin role in one or more " \
        "accounts. This tool does not support updating admin users. Please contact " \
        "a higher-level administrator to edit this user.",
      )
    end
  end

  def search_for_users_on_canvas(search_term, page = nil)
    # We're manually constructing the URL here and using `api_get_request` instead of
    # `canvas_api.proxy("LIST_USERS_IN_ACCOUNT", params)` because `proxy("LIST_USERS_IN_ACCOUNT")`
    # doesn't support the `include` param since it's undocumented.
    query_params = {
      search_term: search_term,
      include: [:email],
    }
    query_params[:page] = page if page.present? # You get a 404 if you pass an empty `page` param.
    canvas_url = "accounts/#{jwt_lms_account_id}/users?#{query_params.to_query}"

    canvas_api.api_get_request(canvas_url)
  end

  def user_being_changed_is_account_admin?
    @list_accounts_response ||= canvas_api.proxy(
      "LIST_ACCOUNTS",
      { as_user_id: params[:id] },
    )

    # The [Canvas API docs](https://canvas.instructure.com/doc/api/accounts.html#method.accounts.index)
    # state that "only account admins can view the accounts that they are in."
    # Thus, we are assuming that a non-empty response means the user is an account admin somewhere.
    @list_accounts_response.present?
  end

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

    matching_login = list_user_logins_response.detect do |login|
      login["unique_id"] == @original_user[:login_id]
    end

    unless matching_login
      raise LMS::Canvas::CanvasException.new(
        "Failed to find matching login for user with login ID: #{@original_user[:login_id]}",
      )
    end

    matching_login
  end

  def edit_user_login_on_canvas(numeric_login_id)
    canvas_api.api_put_request(
      "accounts/#{jwt_lms_account_id}/logins/#{numeric_login_id}",
      "login[unique_id]" => params[:user][:login_id],
      "login[sis_user_id]" => params[:user][:sis_user_id],
    )
  end

  def log_user_change(failed_attrs: [])
    CanvasUserChange.create_by_diffing_attrs!(
      admin_making_changes_lms_id: current_user.lms_user_id,
      user_being_changed_lms_id: params[:id],
      original_attrs: @original_user,
      new_attrs: params[:user].permit([:name, :login_id, :sis_user_id, :email]).to_h,
      failed_attrs: failed_attrs,
    )
  end

  def render_update_user_exception(request_type, exception)
    record_exception(exception)

    message = case request_type
              when :edit_user
                "Something went wrong updating the user. The updates were not " \
                "persisted to Canvas. Please try again."
              when :edit_user_login # The user name and email were updated.
                "Something went wrong updating the user's login ID and/or SIS ID. " \
                "Those attributes were not updated on Canvas. Please reload and try again."
              end

    render_error(
      :internal_server_error,
      "#{message} Canvas API Error: #{exception.message}",
      { exception: exception },
    )
  end
end
