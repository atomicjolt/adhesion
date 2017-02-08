admin = CreateAdminService.new.call
puts "CREATED ADMIN USER: " << admin.email
admin.save!

lti_consumer_uri = Rails.application.secrets.canvas_url

# Add sites
sites = [
  {
    url: lti_consumer_uri,
    oauth_key: Rails.application.secrets.canvas_developer_id,
    oauth_secret: Rails.application.secrets.canvas_developer_key,
  },
]

# Add an LTI Application
scorm_permissions = "CREATE_ASSIGNMENT,DELETE_ASSIGNMENT,LIST_ASSIGNMENTS"
exams_permissions = %w{
  LIST_USERS_IN_COURSE_USERS
  LIST_QUIZZES_IN_COURSE
  GET_SUB_ACCOUNTS_OF_ACCOUNT
}.join(",")
canvas_permissions = "GET_SINGLE_QUIZ,LIST_QUESTIONS_IN_QUIZ_OR_SUBMISSION,CREATE_CONVERSATION"

applications = [
  {
    name: "LTI Admin",
    description: "LTI tool administration",
    client_application_name: "lti_admin_app",
    canvas_api_permissions: "",
    kind: Application.kinds[:admin],
  },
  {
    name: "SCORM Player",
    description: "SCORM Player",
    client_application_name: "scorm",
    canvas_api_permissions: scorm_permissions,
    kind: Application.kinds[:lti],
  },
  {
    name: "Attendance",
    description: "Attendance Application",
    client_application_name: "attendance",
    canvas_api_permissions: "LIST_USERS_IN_COURSE_USERS",
    kind: Application.kinds[:lti],
  },
  {
    name: "Exams",
    description: "Proctor Tool",
    client_application_name: "exams",
    canvas_api_permissions: exams_permissions,
    kind: Application.kinds[:lti],
  },
  {
    name: "Test Administration Tool",
    description: "Test Administration",
    client_application_name: "test_administration",
    canvas_api_permissions: canvas_permissions,
    kind: Application.kinds[:lti],
  },
  {
    name: "Quiz Converter",
    description: "Converts word docs to quizzes",
    client_application_name: "quiz_converter",
    canvas_api_permissions: "",
    kind: Application.kinds[:lti],
  },
  {
    name: "Test Taking Tool",
    description: "Where students take proctored exams",
    client_application_name: "test_taking",
    canvas_api_permissions: "",
    kind: Application.kinds[:lti],
  },
  {
    name: "Survey Aggregation Tool",
    description: "Admin tool to view survey results",
    client_application_name: "survey_tool",
    canvas_api_permissions: "",
    kind: Application.kinds[:lti],
  },
]

application_instances = [
  {
    application: "LTI Admin",
    tenant: "lti-admin",
    lti_key: "lti-admin",
    url: lti_consumer_uri,
    domain: "admin.#{Rails.application.secrets.domain_name}",
  },
  {
    application: "SCORM Player",
    tenant: "scorm-player",
    lti_key: "scorm-player",
    lti_secret: Rails.application.secrets.scorm_lti_secret,
    url: lti_consumer_uri,
    canvas_token: Rails.application.secrets.canvas_token,
    domain: "scorm.#{Rails.application.secrets.domain_name}",
  },
  {
    application: "Attendance",
    tenant: "attendance",
    lti_key: "attendance",
    lti_secret: Rails.application.secrets.attendance_lti_secret,
    url: lti_consumer_uri,
    canvas_token: Rails.application.secrets.canvas_token,
    domain: "attendance.#{Rails.application.secrets.domain_name}",
  },
  {
    application: "Exams",
    tenant: "exams",
    lti_key: "exams",
    lti_secret: Rails.application.secrets.exams_lti_secret,
    url: lti_consumer_uri,
    canvas_token: Rails.application.secrets.canvas_token,
    domain: "exams.#{Rails.application.secrets.domain_name}",
  },
  {
    application: "Quiz Converter",
    tenant: "quiz-converter",
    lti_key: "quiz-converter",
    lti_secret: Rails.application.secrets.quiz_converter_lti_secret,
    url: lti_consumer_uri,
    canvas_token: Rails.application.secrets.canvas_token,
    domain: "quiz-converter.#{Rails.application.secrets.domain_name}",
  },
  {
    application: "Test Administration Tool",
    tenant: "exams",
    lti_key: "test-administration",
    lti_secret: Rails.application.secrets.test_administration_lti_secret,
    url: lti_consumer_uri,
    canvas_token: Rails.application.secrets.canvas_token,
    domain: "test-administration.#{Rails.application.secrets.domain_name}",
  },
  {
    application: "Test Taking Tool",
    tenant: "test-taking",
    lti_key: "test-taking",
    lti_secret: Rails.application.secrets.test_administration_lti_secret,
    url: lti_consumer_uri,
    canvas_token: Rails.application.secrets.canvas_token,
    domain: "test-taking.#{Rails.application.secrets.domain_name}",
  },
  {
    application: "Survey Aggregation Tool",
    tenant: "survey-tool",
    lti_key: "survey-tool",
    lti_secret: Rails.application.secrets.survey_tool_lti_secret,
    url: lti_consumer_uri,
    canvas_token: Rails.application.secrets.canvas_token,
    domain: "survey-tool.#{Rails.application.secrets.domain_name}",
  },
]

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
