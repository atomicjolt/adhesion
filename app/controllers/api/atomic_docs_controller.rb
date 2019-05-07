class Api::AtomicDocsController < ApplicationController
  respond_to :json

  skip_before_action :verify_authenticity_token
  before_action :validate_api_key, only: %i[documents sessions]

  def documents
    atomic_doc = AtomicDoc.find_or_create_by(url: params[:url])
    AtomicDocJob.perform_later(atomic_doc)
    raise
    # render json: { id: atomic_doc.id, status: atomic_doc.status }
  end

  def sessions
    atomic_doc = AtomicDoc.find_or_create_by(url: params[:url])
    session = atomic_doc.atomic_doc_sessions.create
    render json: { id: session.session_id }
  end

  def view
    session = AtomicDocSession.find_by(session_id: params[:id])
    atomic_doc = session.atomic_doc
    if atomic_doc.status == "complete"
      filename = atomic_doc.file_path.split("/").last

      File.open(atomic_doc.file_path, "rb") do |f|
        send_data f.read, filename: filename, type: "application/pdf", disposition: :inline
      end
    else
      render plain: "Processing, please try again later"
    end
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
