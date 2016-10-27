admin = CreateAdminService.create_admin
puts 'CREATED ADMIN USER: ' << admin.email

# Add an LTI Application
lti_applications = [
{
  name: "SCORM Player",
  lti_key: "scorm-player",
  description: "LTI Integration Platform",
  client_application_name: "scorm",
  lti_consumer_uri: "https://atomicjolt.instructure.com",
  lti_secret: Rails.application.secrets.scorm_lti_key,
  canvas_token: Rails.application.secrets.canvas_token,
  canvas_api_permissions: "CREATE_ASSIGNMENT" # List Canvas API methods the app is allowed to use. A full list of constants can be found in canvas_urls
},
{
  name: "Attendance",
  lti_key: "attendance",
  description: "LTI Integration Platform",
  client_application_name: "attendance",
  lti_consumer_uri: "https://atomicjolt.instructure.com",
  lti_secret: Rails.application.secrets.attendance_lti_key,
  canvas_api_permissions: "" # List Canvas API methods the app is allowed to use. A full list of constants can be found in canvas_urls
}]

lti_applications.each do |attrs|
  if lti_application = LtiApplication.find_by(lti_key: attrs[:lti_key])
    lti_application.update_attributes!(attrs)
  else
    LtiApplication.create!(attrs)
  end
end

Lti::Utils.lti_configs
