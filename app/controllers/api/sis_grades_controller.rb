class Api::SisGradesController < Api::ApiApplicationController
  respond_to :json

  skip_before_action :validate_token, only: %i[index]
  before_action :validate_token_shared, only: %i[index]

  def index
    grade = SisGrade.find_by(
      sis_course_id: params[:sis_course_id],
      sis_section_id: params[:sis_section_id],
      gradetype: params[:gradetype] || SisGrade::FINAL,
    )

    if grade.present?
      render json: grade.grades
    else
      raise ActiveRecord::RecordNotFound
    end
  end

  private

  def validate_token_shared
    if params[:shared_auth] == true || params[:shared_auth] == "true"
      aud = Rails.application.secrets.auth0_client_id
      secret = Rails.application.secrets.shared_sis_auth_secret
      validate_token_with_secret(aud, secret)
    else
      validate_token
    end
  end
end
