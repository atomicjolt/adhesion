require "rest-client"

module Integrations

  module U4sm
    def self.post_grades_to_sis(sis_course_id, sis_section_id, gradetype, grades)
      cookie = U4sm.get_cookie
      return 500 if cookie.empty?
      resp = RestClient.post(
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
      resp.code
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
