class Api::SubmissionsController < ApplicationController

  include Concerns::CanvasSupport

  def create
    submissions = []

    # Can either get user info right here with the section of get it previously
    params[:sections].each do |section|
      sub_params = {
        section_id: section["id"],
        assignment_id: params[:assignment_id]
      }
      section_subs = canvas_api.proxy("LIST_ASSIGNMENT_SUBMISSIONS_SECTIONS", sub_params)
      section_users = canvas_api.proxy("LIST_ENROLLMENTS_SECTIONS", { section_id: section["id"] })
      submissions.append({ subs: section_subs, users: section_users, section: section })
    end

    sendable_data = submissions.map do |section_info|
      {
        sis_course_id: section_info[:section][:sis_course_id],
        sis_section_id: section_info[:section][:sis_section_id],
        gradetype: params[:type],
        grades: make_grades(section_info) # return array
      }
    end
  end

  def make_grades(section_info)
    section_info[:subs].map do |sub|
      {
        sis_user_id: get_user_sis(section_info[:users], sub["user_id"]),
        grade: sub["score"]
      }
    end
  end

  def get_user_sis(users, user_id)
    if user = users.find{ |u| u["user_id"] == user_id }
      return user["sis_user_id"]
    end
    return nil
  end
end
