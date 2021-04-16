class Api::TestingCentersAccountsController < ApplicationController
  include JwtToken
  include CanvasSupport
  before_action :validate_token

  def index
    account = TestingCentersAccount.find_by(canvas_instance_name: params[:canvas_instance_name])
    render json: account
  end

  def create
    account = canvas_api.proxy(
      "GET_SINGLE_ACCOUNT",
      { id: params[:testing_centers_account_id] },
    )
    center_account = TestingCentersAccount.find_or_create_by(
      canvas_instance_name: params[:canvas_instance_name],
    )
    center_account.update_attributes(
      testing_centers_account_id: account["parent_account_id"],
    )
    render json: center_account
  end
end
