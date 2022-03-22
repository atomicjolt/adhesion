class Api::SectionMetadataController < Api::ApiApplicationController

  def create
    if params[:updater]
      sections = params[:sections].map do |sec|
        section = SectionMetadata.find_by(lms_course_id: params[:lms_course_id], lms_section_id: sec[:id])
        if params[:type] == SisGrade::MIDTERM
          section.update(any_posted: true, mid_posted: Time.now)
        elsif params[:type] == SisGrade::FINAL
          section.update(any_posted: true, final_posted: Time.now)
        end
        section
      end
    else
      sections = [SectionMetadata.where(lms_course_id: params[:lms_course_id], lms_section_id: -1).first_or_create]
      params[:lms_section_ids].map do |sec_id|
        sections.append(
          SectionMetadata.where(lms_course_id: params[:lms_course_id], lms_section_id: sec_id).first_or_create
        )
      end
    end
    render json: sections
  end
end
