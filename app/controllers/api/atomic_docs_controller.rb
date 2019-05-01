class Api::AtomicDocsController < ApplicationController
  respond_to :json

  skip_before_action :verify_authenticity_token
  before_action :validate_api_key, only: %i[documents sessions]

  def documents
    render json: { id: 1234, status: "queued" }
  end

  def sessions
    render json: { id: "CFAmd3Qjm_2ehBI7HyndnXKsDrQXJ7jHCuzcRv" }
  end

  def view
    render plain: "hi there"
  end

  private

  def validate_api_key
    raise Exceptions::InvalidApiTokenError, "Invalid API token" unless authorized?
  end

  def authorized?
    encoded_token(request) == ApiToken.find_by(name: "atomic-doc")&.token
  end

  def encoded_token(req)
    header = req.headers["Authorization"] || req.headers[:authorization]
    raise Exceptions::InvalidApiTokenError, "No authorization header found" if header.nil?

    token = header.split(" ").last
    raise Exceptions::InvalidApiTokenError, "Invalid authorization header string" if token.nil?

    token
  end
end
