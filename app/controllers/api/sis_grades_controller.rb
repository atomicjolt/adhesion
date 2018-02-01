class Api::SisGradesController < Api::ApiApplicationController
  respond_to :json

  skip_before_action :validate_token, only: %i[index]
  before_action :validate_token_shared, only: %i[index]

  before_action :setup_will_paginate, only: %i[index]

  ##
  # List SisGrades
  #
  # Returns an array of SisGrades as a grades object
  # Optionally returns total_pages if pagination was triggered
  #
  # Optional Parameters
  #
  # start_date: defaults to today - String format of "YYYY-MM-DD"
  # end_date: defaults to today - String format of "YYYY-MM-DD"
  # gradetype: String "final" or "midterm"
  # sis_course_id: String
  # sis_section_id: String
  # sis_user_id: String
  # page: Integer - Requried if per_page is passed in - Must be greater than 0
  # per_page: Integer - Default is 40
  #

  def index
    grades = SisGrade.by_newest

    grades = scope_grades(grades)
    sis_grades = {}

    if params[:page].present?
      grades = grades.paginate(page: @page, per_page: @per_page)
      sis_grades[:total_pages] = grades.total_pages
    end

    sis_grades[:grades] = grades

    render json: sis_grades
  end

  private

  def scope_grades(grades)
    scoped_grades = grades.in_between(params[:start_date] || Date.today, params[:end_date] || Date.today)
    scoped_grades = scoped_grades.for_gradetype(params[:gradetype]) if params[:gradetype].present?
    scoped_grades = scoped_grades.for_sis_course_id(params[:sis_course_id]) if params[:sis_course_id].present?
    scoped_grades = scoped_grades.for_sis_section_id(params[:sis_section_id]) if params[:sis_section_id].present?
    scoped_grades = scoped_grades.for_sis_user_id(params[:sis_user_id]) if params[:sis_user_id].present?
    scoped_grades
  end

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
