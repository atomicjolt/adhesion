class Api::ProctorCodesController < ApplicationController
  include Concerns::JwtToken
  before_action :validate_token

  respond_to :json

  def index
    proctor_codes = ProctorCode.where(proctor_id: params[:proctor_id])
    render json: proctor_codes, each_serializer: ProctorCodeSerializer
  end
end
