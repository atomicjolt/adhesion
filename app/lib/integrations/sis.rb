require "rest-client"

module Integrations

  module Sis
    def self.post_grades_to_db(sis_course_id, sis_section_id, gradetype, grades, sis_user_id = nil)
      sis_grade = SisGrade.find_by(
        gradetype: gradetype,
        sis_course_id: sis_course_id,
        sis_section_id: sis_section_id,
        sis_user_id: sis_user_id,
      )

      # Only create with grades if not found
      if sis_grade.nil?
        SisGrade.create!(
          gradetype: gradetype,
          sis_course_id: sis_course_id,
          sis_section_id: sis_section_id,
          sis_user_id: sis_user_id,
          grades: grades,
        )
      end
    end

    def self.post_grades_to_sis(sis_course_id, sis_section_id, gradetype, grades)
      cookie = Sis.get_cookie
      RestClient.post(
        "#{Rails.application.secrets.u4sm_url}/U4SMAPI/Canvas/CanvasGradePush",
        {
          sis_course_id: sis_course_id,
          sis_section_id: sis_section_id,
          gradetype: gradetype,
          grades: grades,
        },
        {
          content_type: "application/json",
          cookies: {
            ".MosaicAuthorization": cookie,
          },
        },
      )
    end

    def self.get_cookie
      resp = RestClient.post(
        "#{Rails.application.secrets.u4sm_url}/U4SMAPI/api/authentication/login",
        {
          username: Rails.application.secrets.u4sm_username,
          password: Rails.application.secrets.u4sm_password,
        },
      )
      resp.cookies[".MosaicAuthorization"]
    end
  end

end
