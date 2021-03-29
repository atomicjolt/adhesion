class Api::AnnotationsController < Api::ApiApplicationController
  include Concerns::JwtToken
  before_action :validate_token
  before_action :parse_annotation, only: [:create, :update]
  before_action :set_annotation, only: [:show, :update, :destroy]

  respond_to :json

  def index
    annotations = Annotation.where(
      document_id: params[:document_id],
    ).by_recent_comment
    render json: annotations, include: [
      :user,
      {
        annotation_comments: {
          include: :user,
        },
      },
    ]
  end

  def show
    render json: @annotation, include: [
      :user,
      {
        annotation_comments: {
          include: :user,
        },
      },
    ]
  end

  def create
    annotation = current_user.annotations.create!(annotation_params)
    if annotation.save!
      render json: annotation, include: [
        :user,
        {
          annotation_comments: {
            include: :user,
          },
        },
      ]
    end
  end

  def update
    if @annotation.user.id != current_user.id
      user_not_authorized "Only the original author may edit this annotation"
    elsif @annotation.update!(annotation_params)
      render json: @annotation, include: [
        :user,
        {
          annotation_comments: {
            include: :user,
          },
        },
      ]
    end
  end

  def destroy
    if @annotation.user.id != current_user.id
      user_not_authorized "Only the original author may edit this annotation"
    elsif @annotation.destroy!
      head :no_content
    end
  end

  private

  def annotation_params
    result = params.require(:annotation).permit(
      :document_id,
      :page,
      :annotation_type,
      :width,
      :height,
      :x,
      :y,
      :size,
      :color,
      :content,
      rectangles: [
        :x,
        :y,
        :width,
        :height,
      ],
    ).to_h
    if params[:lines]
      result[:lines] = params[:lines]
    end
    result
  end

  def parse_annotation
    params[:annotation] = JSON.parse(params[:annotation])
    params[:annotation][:annotation_type] = params[:annotation].delete "type"
    params[:annotation][:document_id] = params[:document_id]
    params[:annotation][:page] = params[:page]
    if params[:annotation][:lines]
      params[:lines] = params[:annotation].delete "lines"
    end
  end

  def set_annotation
    @annotation = Annotation.find_by!(document_id: params[:document_id], id: params[:id])
  end
end
