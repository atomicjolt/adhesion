class Api::SubmissionsController < Api::ApiApplicationController

  include Concerns::CanvasSupport

  def create
    submissions = []

    params[:sections].each do |section|
      if section["id"].to_i > 0
        sub_params = {
          section_id: section["id"],
          assignment_id: params[:assignment_id],
        }
        if params[:assignment_id] != "total"
          section_subs = canvas_api.proxy("LIST_ASSIGNMENT_SUBMISSIONS_SECTIONS", sub_params)
        end
        section_users = canvas_api.proxy("LIST_ENROLLMENTS_SECTIONS", { section_id: section["id"] })
        submissions.append({ subs: section_subs, users: section_users, section: section })
      end
    end

    submissions.each do |section_info|
      if params[:assignment_id] == "total"
        grades = total_grades(section_info[:users])
      else
        grades = make_grades(section_info)
      end
      Integrations::SIS.post_grades_to_db(
        section_info[:section][:sis_course_id],
        section_info[:section][:sis_section_id],
        params[:type],
        grades,
      )
    end
  end

  def make_grades(section_info)
    section_info[:subs].map do |sub|
      {
        sis_user_id: get_user_sis(section_info[:users], sub["user_id"]),
        grade: sub["grade"].to_f,
      }
    end
  end

  def total_grades(users)
    users.select do |user|
      user["role"] == "StudentEnrollment"
    end.map do |student|
      {
        sis_user_id: student["sis_user_id"],
        grade: student["grades"]["final_score"],
      }
    end
  end

  def get_user_sis(users, user_id)
    if user = users.detect { |u| u["user_id"] == user_id }
      return user["sis_user_id"]
    end
    nil
  end
end
