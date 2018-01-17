class Api::SisGradesController < Api::ApiApplicationController
  respond_to :json

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
end
