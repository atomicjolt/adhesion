admin = CreateAdminService.create_admin
puts "CREATED ADMIN USER: " << admin.email

# Add sites
sites = [{
  url: "https://atomicjolt.instructure.com",
  oauth_key: Rails.application.secrets.canvas_developer_id,
  oauth_secret: Rails.application.secrets.canvas_developer_key
}]

# Add an LTI Application
scorm_permissions = "CREATE_ASSIGNMENT,DELETE_ASSIGNMENT,LIST_ASSIGNMENTS"
exams_permissions = %w{
  LIST_USERS_IN_COURSE_USERS
  LIST_QUIZZES_IN_COURSE
  GET_SUB_ACCOUNTS_OF_ACCOUNT
}.join(",")
canvas_permissions = "GET_SINGLE_QUIZ,LIST_QUESTIONS_IN_QUIZ_OR_SUBMISSION,CREATE_CONVERSATION"

applications = [{
  name: "LTI Admin",
  description: "LTI tool administration",
  client_application_name: "lti_admin_app",
  canvas_api_permissions: "",
  kind: Application.kinds[:admin],
}, {
  name: "SCORM Player",
  description: "SCORM Player",
  client_application_name: "scorm",
  canvas_api_permissions: scorm_permissions,
}, {
  name: "Attendance",
  description: "Attendance Application",
  client_application_name: "attendance",
  canvas_api_permissions: "LIST_USERS_IN_COURSE_USERS",
}, {
  name: "Exams",
  description: "Proctor Tool",
  client_application_name: "exams",
  canvas_api_permissions: exams_permissions
}, {
  name: "Test Administration Tool",
  description: "Test Administration",
  client_application_name: "test_administration",
  canvas_api_permissions: canvas_permissions,
}, {
  name: "Quiz Converter",
  description: "Converts word docs to quizzes",
  client_application_name: "quiz_converter",
  canvas_api_permissions: "",
}, {
  name: "Test Taking Tool",
  description: "Where students take proctored exams",
  client_application_name: "test_taking",
  canvas_api_permissions: "",
}, {
  name: "Survey Aggregation Tool",
  description: "Admin tool to view survey results",
  client_application_name: "survey_tool",
  canvas_api_permissions: "",
}]

lti_consumer_uri = Rails.application.secrets.canvas_url

application_instances = [{
  application: "LTI Admin",
  lti_key: "lti-admin",
  url: "https://atomicjolt.instructure.com",
  domain: "admin.#{ENV['APP_URL']}"
}, {
  application: "SCORM Player",
  lti_key: "scorm-player",
  lti_secret: Rails.application.secrets.scorm_lti_secret,
  lti_consumer_uri: lti_consumer_uri,
  canvas_token: Rails.application.secrets.canvas_token,
}, {
  application: "Attendance",
  lti_key: "attendance",
  lti_secret: Rails.application.secrets.attendance_lti_secret,
  lti_consumer_uri: lti_consumer_uri,
  canvas_token: Rails.application.secrets.canvas_token,
}, {
  application: "Exams",
  lti_key: "exams",
  lti_secret: Rails.application.secrets.exams_lti_secret,
  lti_consumer_uri: lti_consumer_uri,
  canvas_token: Rails.application.secrets.canvas_token,
}, {
  application: "Quiz Converter",
  lti_key: "quiz-converter",
  lti_secret: Rails.application.secrets.quiz_converter_lti_secret,
  lti_consumer_uri: lti_consumer_uri,
  canvas_token: Rails.application.secrets.canvas_token,
}, {
  application: "Test Administration Tool",
  lti_key: "test-administration",
  lti_secret: Rails.application.secrets.test_administration_lti_secret,
  lti_consumer_uri: lti_consumer_uri,
  canvas_token: Rails.application.secrets.canvas_token,
}, {
  application: "Test Taking Tool",
  lti_key: "test-taking",
  lti_secret: Rails.application.secrets.test_administration_lti_secret,
  lti_consumer_uri: lti_consumer_uri,
  canvas_token: Rails.application.secrets.canvas_token,
}, {
  application: "Survey Aggregation Tool",
  lti_key: "survey-tool",
  lti_secret: Rails.application.secrets.survey_tool_lti_secret,
  lti_consumer_uri: lti_consumer_uri,
  canvas_token: Rails.application.secrets.canvas_token,
}]

sites.each do |attrs|
  if site = Site.find_by(url: attrs[:url])
    site.update_attributes!(attrs)
  else
    Site.create!(attrs)
  end
end

applications.each do |attrs|
  if application = Application.find_by(name: attrs[:name])
    application.update_attributes!(attrs)
  else
    Application.create!(attrs)
  end
end

application_instances.each do |attrs|
  application = Application.find_by(name: attrs.delete(:application))
  site = Site.find_by(url: attrs.delete(:url))
  attrs = attrs.merge(application_id: application.id, site_id: site.id)

  if application_instance = ApplicationInstance.find_by(lti_key: attrs[:lti_key])
    # Don't change production lti keys or set keys to nil
    attrs.delete(:lti_secret) if attrs[:lti_secret].blank? || Rails.env.production?

    application_instance.update_attributes!(attrs)
  else
    ApplicationInstance.create!(attrs)
  end
end

Lti::Utils.lti_configs
