class Api::AnnotationsController < ApplicationController
  include Concerns::JwtToken
  before_action :validate_token
  before_action :parse_annotation, only: [:create, :update]
  before_action :set_annotation, only: [:show, :update, :destroy]

  respond_to :json

  def index
    annotations = Annotation.where(
      document_id: params[:document_id],
      page: params[:page],
    )
    render json: annotations, :include => [:user, :annotation_comments => {:include => {:user => {:only => :name}}}]
  end

  def show
    render json: @annotation, :include => [:user, :annotation_comments => {:include => {:user => {:only => :name}}}]
  end

  def create
    annotation = current_user.annotations.new(annotation_params)
    if annotation.save!
      render json: annotation, :include => [:user, :annotation_comments => {:include => {:user => {:only => :name}}}]
    end
  end

  def update
    if @annotation.update(annotation_params)
      render json: @annotation, :include => [:user, :annotation_comments => {:include => {:user => {:only => :name}}}]
    end
  end

  def destroy
    if @annotation.destroy
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
