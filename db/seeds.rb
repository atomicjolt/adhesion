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

applications = [
  {
    name: "LTI Admin",
    description: "LTI tool administration",
    client_application_name: "admin_app",
    canvas_api_permissions: %w(
      LIST_ACTIVE_COURSES_IN_ACCOUNT
      LIST_EXTERNAL_TOOLS_COURSES
      CREATE_EXTERNAL_TOOL_COURSES
      DELETE_EXTERNAL_TOOL_COURSES
      LIST_EXTERNAL_TOOLS_ACCOUNTS
      CREATE_EXTERNAL_TOOL_ACCOUNTS
      DELETE_EXTERNAL_TOOL_ACCOUNTS
      GET_SUB_ACCOUNTS_OF_ACCOUNT
      HELPER_ALL_ACCOUNTS
    ).join(","),
    kind: Application.kinds[:admin],
    application_instances: [{
      tenant: "lti-admin",
      lti_key: "lti-admin",
      site_url: lti_consumer_uri,
      domain: "admin.#{Rails.application.secrets.domain_name}",
      lti_type: ApplicationInstance.lti_types[:account_navigation],
    }],
  },
  {
    name: "SCORM Player",
    description: "SCORM Player",
    client_application_name: "scorm",
    canvas_api_permissions: "CREATE_ASSIGNMENT,DELETE_ASSIGNMENT,LIST_ASSIGNMENTS",
    kind: Application.kinds[:lti],
    application_instances: [{
      tenant: "scorm-player",
      lti_key: "scorm-player",
      lti_secret: Rails.application.secrets.scorm_lti_secret,
      site_url: lti_consumer_uri,
      canvas_token: Rails.application.secrets.canvas_token,
      domain: "scorm.#{Rails.application.secrets.domain_name}",
      lti_type: ApplicationInstance.lti_types[:course_navigation],
    }],
  },
  {
    name: "Attendance",
    description: "Attendance Application",
    client_application_name: "attendance",
    canvas_api_permissions: "LIST_USERS_IN_COURSE_USERS",
    kind: Application.kinds[:lti],
    application_instances: [{
      tenant: "attendance",
      lti_key: "attendance",
      lti_secret: Rails.application.secrets.attendance_lti_secret,
      site_url: lti_consumer_uri,
      canvas_token: Rails.application.secrets.canvas_token,
      domain: "attendance.#{Rails.application.secrets.domain_name}",
      lti_type: ApplicationInstance.lti_types[:course_navigation],
    }],
  },
  {
    name: "Exams",
    description: "Proctor Tool",
    client_application_name: "exams",
    canvas_api_permissions: %w{
      LIST_USERS_IN_COURSE_USERS
      LIST_QUIZZES_IN_COURSE
      GET_SUB_ACCOUNTS_OF_ACCOUNT
    }.join(","),
    kind: Application.kinds[:lti],
    application_instances: [{
      tenant: "exam",
      lti_key: "exam",
      lti_secret: Rails.application.secrets.exams_lti_secret,
      site_url: lti_consumer_uri,
      canvas_token: Rails.application.secrets.canvas_token,
      domain: "exam.#{Rails.application.secrets.domain_name}",
      lti_type: ApplicationInstance.lti_types[:course_navigation],
    }],
  },
  {
    name: "Test Administration Tool",
    description: "Test Administration",
    client_application_name: "test_administration",
    canvas_api_permissions: "GET_SINGLE_QUIZ,LIST_QUESTIONS_IN_QUIZ_OR_SUBMISSION,CREATE_CONVERSATION",
    kind: Application.kinds[:lti],
    application_instances: [{
      tenant: "exam",
      lti_key: "proctor",
      lti_secret: Rails.application.secrets.test_administration_lti_secret,
      site_url: lti_consumer_uri,
      canvas_token: Rails.application.secrets.canvas_token,
      domain: "proctor.#{Rails.application.secrets.domain_name}",
      lti_type: ApplicationInstance.lti_types[:account_navigation],
    }],
  },
  {
    name: "Quiz Converter",
    description: "Converts word docs to quizzes",
    client_application_name: "quiz_converter",
    canvas_api_permissions: "",
    kind: Application.kinds[:lti],
    application_instances: [{
      tenant: "word2quiz",
      lti_key: "word2quiz",
      lti_secret: Rails.application.secrets.quiz_converter_lti_secret,
      site_url: lti_consumer_uri,
      canvas_token: Rails.application.secrets.canvas_token,
      domain: "word2quiz.#{Rails.application.secrets.domain_name}",
      lti_type: ApplicationInstance.lti_types[:course_navigation],
    }],
  },
  {
    name: "Survey Aggregation Tool",
    description: "Admin tool to view survey results",
    client_application_name: "survey_tool",
    canvas_api_permissions: "",
    kind: Application.kinds[:lti],
    application_instances: [{
      tenant: "surveys",
      lti_key: "surveys",
      lti_secret: Rails.application.secrets.survey_tool_lti_secret,
      site_url: lti_consumer_uri,
      canvas_token: Rails.application.secrets.canvas_token,
      domain: "surveys.#{Rails.application.secrets.domain_name}",
      lti_type: ApplicationInstance.lti_types[:course_navigation],
    }],
  },
]

def setup_application_instances(application, application_instances)
  application_instances.each do |attrs|
    site = Site.find_by(url: attrs.delete(:site_url))
    attrs = attrs.merge(application_id: application.id, site_id: site.id)

    if application_instance = ApplicationInstance.find_by(lti_key: attrs[:lti_key])
      # Don't change production lti keys or set keys to nil
      attrs.delete(:lti_secret) if attrs[:lti_secret].blank? || Rails.env.production?

      application_instance.update_attributes!(attrs)
    else
      ApplicationInstance.create!(attrs)
    end
  end
end

sites.each do |attrs|
  if site = Site.find_by(url: attrs[:url])
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

Lti::Utils.lti_configs
