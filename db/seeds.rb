admin = CreateAdminService.create_admin
puts 'CREATED ADMIN USER: ' << admin.email

# Add an LTI Application
lti_applications = [{
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

lti_application_instances = [{
  lti_application: "LTI Starter App",
  lti_key: Rails.application.secrets.default_lti_key,
  lti_secret: Rails.application.secrets.default_lti_secret,
  lti_consumer_uri: "https://atomicjolt.instructure.com",
  canvas_token: Rails.application.secrets.canvas_token # This is only required if the app needs API access and doesn't want each user to do the oauth dance
}]

lti_applications.each do |attrs|
  if lti_application = LtiApplication.find_by(name: attrs[:name])
    lti_application.update_attributes!(attrs)
  else
    LtiApplication.create!(attrs)
  end
end

lti_application_instances.each do |attrs|
  lti_application = LtiApplication.find_by(name: attrs.delete(:lti_application))
  attrs = attrs.merge(lti_application_id: lti_application.id)
  if lti_application_instance = LtiApplicationInstance.find_by(lti_key: attrs[:lti_key])
    lti_application_instance.update_attributes!(attrs)
  else
    LtiApplicationInstance.create!(attrs)
  end
end


Lti::Utils.lti_configs