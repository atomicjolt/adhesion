class Api::SubmissionsController < Api::ApiApplicationController

  include Concerns::CanvasSupport

  def create
    submissions = extract_submissions(params[:sections])

    submissions.each do |section_info|
      Integrations::SIS.post_grades_to_db(
        section_info[:section][:sis_course_id],
        section_info[:section][:sis_section_id],
        params[:gradetype],
        grades(section_info),
      )
    end

    render json: {}, status: 200
  end

  def extract_submissions(sections)
    sections.select do |sec|
      sec["id"].to_i > 0
    end.map do |section|
      if params[:assignment_id] != "total"
        sub_params = {
          section_id: section["id"],
          assignment_id: params[:assignment_id],
        }
        section_subs = canvas_api.proxy(
          "LIST_ASSIGNMENT_SUBMISSIONS_SECTIONS",
          sub_params,
          nil,
          true,
        )
      end

      section_users = canvas_api.proxy(
        "LIST_ENROLLMENTS_SECTIONS",
        { section_id: section["id"] },
        nil,
        true,
      )

      {
        subs: section_subs,
        users: section_users,
        section: section,
      }
    end
  end

  def grades(section_info)
    if params[:assignment_id] == "total"
      extract_total_grades(section_info)
    else
      extract_submission_grades(section_info)
    end
  end

  def extract_submission_grades(section_info)
    section_info[:subs].map do |sub|
      {
        sis_user_id: get_user_sis(section_info[:users], sub["user_id"]),
        grade: sub["grade"].to_f,
      }
    end
  end

  def extract_total_grades(section_info)
    section_info[:users].select do |user|
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
      user["sis_user_id"]
    end
  end
end
