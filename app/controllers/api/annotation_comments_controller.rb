class Api::AnnotationCommentsController < ApplicationController
  include Concerns::JwtToken
  before_action :validate_token
  before_action :set_annotation, only: [:create]
  before_action :set_comment, only: [:destroy]

  respond_to :json

  def index
    comments = AnnotationComment.where(
      document_id: params[:document_id],
      annotation_id: params[:annotation_id],
    )
    render json: comments, include: :user
  end

  # POST /api/annotation_comments
  def create
    comment = @annotation.annotation_comments.new(comment_params)
    if comment.save!
      render json: comment, include: :user
    end
  end

  # DELETE /api/annotation_comments/:id
  def destroy
    if @annotation_comment.destroy!
      head :no_content
    end
  end

  private

  def comment_params
    result = params.permit(
      :annotation_id,
      :document_id,
      :content,
    ).to_h
    result[:user_id] = current_user.id
    result
  end

  def set_annotation
    @annotation = Annotation.find(params[:annotation_id])
  end

  def set_comment
    @annotation_comment = AnnotationComment.find_by!(
      id: params[:id],
      document_id: params[:document_id],
    )
  end
end
