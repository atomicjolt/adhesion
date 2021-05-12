class Api::AnnotationCommentsController < Api::ApiApplicationController
  before_action :validate_current_user
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
    comment = @annotation.annotation_comments.create!(comment_params)
    @annotation.last_comment_created_at = comment.created_at
    if @annotation.save!
      render json: comment, include: :user
    end
  end

  # DELETE /api/annotation_comments/:id
  def destroy
    if @annotation_comment.user.id != current_user.id
      user_not_authorized "Only the original author may edit this annotation comment"
    elsif @annotation_comment.destroy!
      head :no_content
    end
  end

  private

  def validate_current_user
    current_user.lti_instructor?(jwt_context_id) ||
      current_user.lti_ta?(jwt_context_id) ||
      current_user.lti_admin?(jwt_context_id) ||
      current_user.student_in_course?(jwt_context_id)
  end

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
