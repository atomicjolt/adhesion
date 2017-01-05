class Api::TestingCentersAccountsController < ApplicationController
  include Concerns::JwtToken
  include Concerns::CanvasSupport
  before_action :validate_token

  def index
    account = canvas_api.proxy(
      "GET_SINGLE_ACCOUNT",
      { id: params[:account_id] }
    )
    center_account = TestingCentersAccount.find_or_create_by(
      canvas_instance_name: params[:instance_name]
    )
    center_account.update_attributes(
      testing_centers_account_id: account["parent_account_id"]
    )
    render json: center_account
  end
end
