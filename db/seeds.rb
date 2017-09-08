admin = CreateAdminService.new.call
puts "CREATED ADMIN USER: " << admin.email
admin.save!

secrets = Rails.application.secrets

# Add sites
sites = [
  {
    url: secrets.canvas_url,
    oauth_key: secrets.canvas_developer_id,
    oauth_secret: secrets.canvas_developer_key,
  },
]

# Each API endpoint must include a list of LTI and internal roles that are allowed to call the endpoint.
# A list of possible roles is available in the IMS LTI specification:
# https://www.imsglobal.org/specs/ltiv1p1p1/implementation-guide#toc-41
# If an endpoint does not list a role then the roles listed under "default" will be used.
# Roles included in "common" will be merged into each API endpoint's roles.
#
# Examples roles from Canvas LTI launch
# urn:lti:instrole:ims/lis/Administrator, Institution Role
# urn:lti:instrole:ims/lis/Instructor,    Institution Role
# urn:lti:instrole:ims/lis/Student,       Institution Role
# urn:lti:role:ims/lis/Instructor,        Context Role
# urn:lti:role:ims/lis/Learner,           Context Role
# urn:lti:sysrole:ims/lis/User            System Role

admin_api_permissions = {
  default: [
    "administrator", # Internal (non-LTI) role
    "urn:lti:sysrole:ims/lis/SysAdmin",
    "urn:lti:sysrole:ims/lis/Administrator",
  ],
  common: [],
  LIST_ACTIVE_COURSES_IN_ACCOUNT: [],
  LIST_EXTERNAL_TOOLS_COURSES: [],
  CREATE_EXTERNAL_TOOL_COURSES: [],
  DELETE_EXTERNAL_TOOL_COURSES: [],
  LIST_EXTERNAL_TOOLS_ACCOUNTS: [],
  CREATE_EXTERNAL_TOOL_ACCOUNTS: [],
  DELETE_EXTERNAL_TOOL_ACCOUNTS: [],
  GET_SUB_ACCOUNTS_OF_ACCOUNT: [],
  HELPER_ALL_ACCOUNTS: [],
}

bundles = []

applications = [
  {
    key: Application::ADMIN,
    name: "LTI Admin",
    description: "LTI tool administration",
    client_application_name: "admin_app",
    canvas_api_permissions: admin_api_permissions,
    kind: Application.kinds[:admin],
    application_instances: [{
      lti_key: Application::ADMIN,
      site_url: secrets.canvas_url,
    }],
  },
  # {
  #   key: Application::SCORM,
  #   name: "SCORM Player",
  #   description: "SCORM Player",
  #   client_application_name: "scorm",
  #   canvas_api_permissions: "CREATE_ASSIGNMENT,DELETE_ASSIGNMENT,LIST_ASSIGNMENTS",
  #   kind: Application.kinds[:lti],
  #   default_config: { "scorm_type" => "cloud" },
  #   application_instances: [{
  #     tenant: "scorm-player",
  #     lti_key: "scorm-player",
  #     lti_secret: secrets.scorm_lti_secret,
  #     site_url: lti_consumer_uri,
  #     canvas_token: secrets.canvas_token,
  #     domain: "scorm.#{secrets.domain_name}",
  #     lti_type: ApplicationInstance.lti_types[:course_navigation],
  #   }],
  # },
  # {
  #   name: "Attendance",
  #   description: "Attendance Application",
  #   client_application_name: "attendance",
  #   canvas_api_permissions: %w(
  #     LIST_USERS_IN_COURSE_USERS
  #     LIST_COURSE_SECTIONS
  #   ).join(","),
  #   kind: Application.kinds[:lti],
  #   application_instances: [{
  #     tenant: "attendance",
  #     lti_key: "attendance",
  #     lti_secret: secrets.attendance_lti_secret,
  #     site_url: lti_consumer_uri,
  #     canvas_token: secrets.canvas_token,
  #     domain: "attendance.#{secrets.domain_name}",
  #     lti_type: ApplicationInstance.lti_types[:course_navigation],
  #   }],
  # },
  # {
  #   name: "Exams",
  #   description: "Proctor Tool",
  #   client_application_name: "exams",
  #   canvas_api_permissions: %w{
  #     LIST_USERS_IN_COURSE_USERS
  #     LIST_QUIZZES_IN_COURSE
  #     GET_SUB_ACCOUNTS_OF_ACCOUNT
  #   }.join(","),
  #   kind: Application.kinds[:lti],
  #   application_instances: [{
  #     tenant: "exam",
  #     lti_key: "exam",
  #     lti_secret: secrets.exams_lti_secret,
  #     site_url: lti_consumer_uri,
  #     canvas_token: secrets.canvas_token,
  #     domain: "exam.#{secrets.domain_name}",
  #     lti_type: ApplicationInstance.lti_types[:course_navigation],
  #   }],
  # },
  # {
  #   name: "Exam Proctoring",
  #   description: "Exam Proctoring",
  #   client_application_name: "exam_proctoring",
  #   canvas_api_permissions: %w{
  #     GET_SINGLE_QUIZ
  #     LIST_QUESTIONS_IN_QUIZ_OR_SUBMISSION
  #     CREATE_CONVERSATION
  #     LIST_USERS_IN_ACCOUNT
  #     STORE_CUSTOM_DATA
  #     LOAD_CUSTOM_DATA
  #     DELETE_CUSTOM_DATA
  #   }.join(","),
  #   kind: Application.kinds[:lti],
  #   application_instances: [{
  #     tenant: "exam",
  #     lti_key: "proctor",
  #     lti_secret: secrets.test_administration_lti_secret,
  #     site_url: lti_consumer_uri,
  #     canvas_token: secrets.canvas_token,
  #     domain: "proctor.#{secrets.domain_name}",
  #     lti_type: ApplicationInstance.lti_types[:account_navigation],
  #   }],
  # },
  # {
  #   name: "Quiz Converter",
  #   description: "Converts word docs to quizzes",
  #   client_application_name: "quiz_converter",
  #   canvas_api_permissions: "",
  #   kind: Application.kinds[:lti],
  #   application_instances: [{
  #     tenant: "word2quiz",
  #     lti_key: "word2quiz",
  #     lti_secret: secrets.quiz_converter_lti_secret,
  #     site_url: lti_consumer_uri,
  #     canvas_token: secrets.canvas_token,
  #     domain: "word2quiz.#{secrets.domain_name}",
  #     lti_type: ApplicationInstance.lti_types[:course_navigation],
  #   }],
  # },
  # {
  #   name: "Survey Aggregation Tool",
  #   description: "Admin tool to view survey results",
  #   client_application_name: "survey_tool",
  #   canvas_api_permissions: "",
  #   kind: Application.kinds[:lti],
  #   application_instances: [{
  #     tenant: "surveys",
  #     lti_key: "surveys",
  #     lti_secret: secrets.survey_tool_lti_secret,
  #     site_url: lti_consumer_uri,
  #     canvas_token: secrets.canvas_token,
  #     domain: "surveys.#{secrets.domain_name}",
  #     lti_type: ApplicationInstance.lti_types[:course_navigation],
  #   }],
  # },
]

def setup_application_instances(application, application_instances)
  application_instances.each do |attrs|
    site = Site.find_by(url: attrs.delete(:site_url))
    attrs = attrs.merge(site_id: site.id)
    share_instance = attrs.delete(:share_instance)

    app_inst = application.application_instances.new(attrs)
    if application_instance = application.application_instances.find_by(lti_key: app_inst.key)
      # Don't change production lti keys or set keys to nil
      attrs.delete(:lti_secret) if attrs[:lti_secret].blank? || Rails.env.production?

      application_instance.update_attributes!(attrs)
    else
      application_instance = application.application_instances.create!(attrs)
    end

    # Check to see if the application instance needs to share a tenant with another
    # application instance. To use this include a value on the application instance
    # called "share_instance" and set it to the application key related to the
    # application instance it should share tenants with.
    if share_instance
      application_instance.tenant = application_instance.key(share_instance)
      application_instance.save!
    end
  end
end

sites.each do |attrs|
  if site = Site.find_by(url: attrs[:url])
    byebug
    site.update_attributes!(attrs)
  else
    Site.create!(attrs)
  end
end

applications.each do |attrs|
  application_instances = attrs.delete(:application_instances)
  if application = Application.find_by(name: attrs[:name])
    application.update_attributes!(attrs)
  else
    application = Application.create!(attrs)
  end
  setup_application_instances(application, application_instances)
end

bundles.each do |attrs|
  current_bundle = Bundle.find_or_create_by(key: attrs[:key])
  current_bundle.update!(name: attrs[:name], shared_tenant: attrs[:shared_tenant] == true)
  attrs[:applications].reduce(current_bundle) do |bundle, key|
    app = Application.find_by!(key: key)
    bundle.application_bundles.find_or_create_by(bundle_id: bundle.id, application_id: app.id)
    bundle
  end
end

begin
  Apartment::Tenant.create Application::AUTH
rescue Apartment::TenantExists
  # Do nothing if the tenant already exists
end
