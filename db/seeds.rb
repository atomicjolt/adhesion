admin = CreateAdminService.create_admin
puts 'CREATED ADMIN USER: ' << admin.email

# Add an LTI Application
lti_applications = [{
  name: "Adhesion",
  lti_key: "adhesion",
  description: "LTI Integration Platform",
  client_application_name: "app",
  canvas_uri: "https://atomicjolt.instructure.com"
}]

lti_applications.each do |attrs|
  if lti_application = LtiApplication.find_by(lti_key: attrs[:lti_key])
    lti_application.update_attributes!(attrs)
  else
    LtiApplication.create!(attrs)
  end
end

Lti::Utils.lti_configs