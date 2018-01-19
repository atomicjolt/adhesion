require "rest-client"

module Integrations

  module SIS
    def self.post_grades_to_db(sis_course_id, sis_section_id, gradetype, grades)
      grade = SisGrade.find_or_create_by(
        sis_course_id: sis_course_id,
        sis_section_id: sis_section_id,
        gradetype: gradetype,
      )

      grade.update_grades(grades)
    end

    def self.post_grades_to_sis(sis_course_id, sis_section_id, gradetype, grades)
      cookie = SIS.get_cookie
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
