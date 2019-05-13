class Api::AtomicDocsController < ApplicationController
  respond_to :json

  layout "client"

  skip_before_action :verify_authenticity_token
  before_action :validate_api_key, only: %i[documents sessions]

  def documents
    atomic_doc = AtomicDoc.find_or_create_by(url: params[:url])
    AtomicDocJob.perform_later(atomic_doc)
    render json: { id: atomic_doc.id, status: atomic_doc.status }
  end

  def sessions
    atomic_doc = AtomicDoc.find_or_create_by(url: params[:url])
    session = atomic_doc.atomic_doc_sessions.create
    render json: { id: session.session_id }
  end

  def session_status
    session = AtomicDocSession.find_by(session_id: params[:id])
    atomic_doc = session.atomic_doc
    if atomic_doc.status == "complete"
      filename = atomic_doc.file_path.split("/").last
      render json: {
        pdf_download_url: pdf_file_api_atomic_docs_path(session.session_id),
        document_name: filename,
      }
    else
      render json: { error: "document_not_ready", retry_after: 2 }, status: 202
    end
  end

  def view
    @session = AtomicDocSession.find_by(session_id: params[:id])
  end

  def pdf_file
    session = AtomicDocSession.find_by(session_id: params[:id])
    atomic_doc = session.atomic_doc
    filename = atomic_doc.file_path.split("/").last

    File.open(atomic_doc.file_path, "rb") do |f|
      send_data f.read, filename: filename, type: "application/pdf", disposition: :inline
    end
  end

  private

  def validate_api_key
    raise Exceptions::InvalidApiTokenError, "Invalid API token" unless authorized?
  rescue Exceptions::InvalidApiTokenError
    render json: { error: "Unauthorized: Invalid token." }, status: :unauthorized
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
