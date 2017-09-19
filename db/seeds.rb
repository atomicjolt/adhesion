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
      domain: "#{Application::ADMIN}.#{Rails.application.secrets.application_root_domain}",
    }],
  },
  {
    key: Application::SCORM,
    name: "SCORM Player",
    description: "SCORM Player",
    client_application_name: "scorm",
    canvas_api_permissions: {
      default: [],
      common: [
        "urn:lti:sysrole:ims/lis/SysAdmin",
        "urn:lti:sysrole:ims/lis/Administrator",
        "urn:lti:instrole:ims/lis/Administrator",
        "urn:lti:role:ims/lis/Instructor",
      ],
      LIST_ASSIGNMENTS: [
        "urn:lti:role:ims/lis/Learner",
        "urn:lti:sysrole:ims/lis/User",
      ],
      CREATE_ASSIGNMENT: [],
      DELETE_ASSIGNMENT: [],
    },
    kind: Application.kinds[:lti],
    default_config: { "scorm_type" => "engine" },
    lti_config: {
      title: "SCORM Player",
      description: "SCORM Player Application",
      privacy_level: "public",
      icon: "oauth_icon.png",
      custom_fields: {
        canvas_course_id: "$Canvas.course.id",
        external_tool_url: "$Canvas.externalTool.url",
      },
      course_navigation: {
        text: "SCORM Player",
        visibility: "members",
      },
    },
    application_instances: [],
    # application_instances: [{
    #   tenant: "scorm-player",
    #   lti_key: "scorm-player",
    #   lti_secret: secrets.scorm_lti_secret,
    #   site_url: lti_consumer_uri,
    #   canvas_token: secrets.canvas_token,
    #   domain: "scorm.#{secrets.domain_name}",
    #   lti_type: ApplicationInstance.lti_types[:course_navigation],
    # }],
  },
  {
    key: Application::ATTENDANCE,
    name: "Attendance",
    description: "Attendance Application",
    client_application_name: "attendance",
    canvas_api_permissions: {
      default: [],
      common: [
        "urn:lti:sysrole:ims/lis/SysAdmin",
        "urn:lti:sysrole:ims/lis/Administrator",
        "urn:lti:instrole:ims/lis/Administrator",
        "urn:lti:role:ims/lis/Instructor",
      ],
      LIST_USERS_IN_COURSE_USERS: [],
      LIST_COURSE_SECTIONS: [],
    },
    kind: Application.kinds[:lti],
    default_config: {},
    lti_config: {
      title: "Attendance",
      description: "Attendance Application",
      privacy_level: "public",
      icon: "oauth_icon.png",
      custom_fields: {
        canvas_course_id: "$Canvas.course.id",
        external_tool_url: "$Canvas.externalTool.url",
      },
      course_navigation: {
        text: "Attendance",
        visibility: "admins",
      },
    },
    application_instances: [],
    # application_instances: [{
    #   tenant: "attendance",
    #   lti_key: "attendance",
    #   lti_secret: secrets.attendance_lti_secret,
    #   site_url: lti_consumer_uri,
    #   canvas_token: secrets.canvas_token,
    #   domain: "attendance.#{secrets.domain_name}",
    #   lti_type: ApplicationInstance.lti_types[:course_navigation],
    # }],
  },
  {
    key: Application::EXAMS,
    name: "Exams",
    description: "Proctor Tool",
    client_application_name: "exams",
    canvas_api_permissions: {
      default: [],
      common: [
        "urn:lti:sysrole:ims/lis/SysAdmin",
        "urn:lti:sysrole:ims/lis/Administrator",
        "urn:lti:instrole:ims/lis/Administrator",
        "urn:lti:role:ims/lis/Instructor",
      ],
      LIST_QUIZZES_IN_COURSE: [
        "urn:lti:role:ims/lis/Learner",
        "urn:lti:sysrole:ims/lis/User",
      ],
      GET_SUB_ACCOUNTS_OF_ACCOUNT: [
        "urn:lti:role:ims/lis/Learner",
        "urn:lti:sysrole:ims/lis/User",
      ],
    },
    kind: Application.kinds[:lti],
    default_config: {},
    lti_config: {
      title: "Exams",
      description: "Exams Application",
      privacy_level: "public",
      icon: "oauth_icon.png",
      custom_fields: {
        canvas_course_id: "$Canvas.course.id",
        external_tool_url: "$Canvas.externalTool.url",
      },
      course_navigation: {
        text: "Exams",
        visibility: "members",
      },
    },
    application_instances: [],
    # application_instances: [{
    #   tenant: "exam",
    #   lti_key: "exam",
    #   lti_secret: secrets.exams_lti_secret,
    #   site_url: lti_consumer_uri,
    #   canvas_token: secrets.canvas_token,
    #   domain: "exam.#{secrets.domain_name}",
    #   lti_type: ApplicationInstance.lti_types[:course_navigation],
    # }],
  },
  {
    key: Application::EXAMPROCTOR,
    name: "Exam Proctoring",
    description: "Exam Proctoring",
    client_application_name: "exam_proctoring",
    canvas_api_permissions: {
      default: [],
      common: [
        "urn:lti:sysrole:ims/lis/SysAdmin",
        "urn:lti:sysrole:ims/lis/Administrator",
        "urn:lti:instrole:ims/lis/Administrator",
        "urn:lti:role:ims/lis/Instructor",
      ],
      GET_SINGLE_QUIZ: [],
      LIST_QUESTIONS_IN_QUIZ_OR_SUBMISSION: [],
      CREATE_CONVERSATION: [],
      LIST_USERS_IN_ACCOUNT: [],
      STORE_CUSTOM_DATA: [],
      LOAD_CUSTOM_DATA: [],
      DELETE_CUSTOM_DATA: [],
    },
    kind: Application.kinds[:lti],
    default_config: {},
    lti_config: {
      title: "Exam Proctoring",
      description: "Exam Proctoring Application",
      privacy_level: "public",
      icon: "oauth_icon.png",
      custom_fields: {
        canvas_course_id: "$Canvas.course.id",
        external_tool_url: "$Canvas.externalTool.url",
      },
      account_navigation: {
        text: "Exam Proctoring",
        visibility: "admins",
      },
    },
    application_instances: [],
    # application_instances: [{
    #   tenant: "exam",
    #   lti_key: "proctor",
    #   lti_secret: secrets.test_administration_lti_secret,
    #   site_url: lti_consumer_uri,
    #   canvas_token: secrets.canvas_token,
    #   domain: "proctor.#{secrets.domain_name}",
    #   lti_type: ApplicationInstance.lti_types[:account_navigation],
    # }],
  },
  {
    key: Application::QUIZCONVERTER,
    name: "Quiz Converter",
    description: "Converts word docs to quizzes",
    client_application_name: "quiz_converter",
    canvas_api_permissions: {
      default: [],
      common: [
        "urn:lti:sysrole:ims/lis/SysAdmin",
        "urn:lti:sysrole:ims/lis/Administrator",
        "urn:lti:instrole:ims/lis/Administrator",
        "urn:lti:role:ims/lis/Instructor",
      ],
    },
    kind: Application.kinds[:lti],
    default_config: {},
    lti_config: {
      title: "Quiz Converter",
      description: "Quiz Converter Application",
      privacy_level: "public",
      icon: "oauth_icon.png",
      custom_fields: {
        canvas_course_id: "$Canvas.course.id",
        external_tool_url: "$Canvas.externalTool.url",
      },
      course_navigation: {
        text: "Quiz Converter",
        visibility: "admins",
      },
    },
    application_instances: [],
    # application_instances: [{
    #   tenant: "word2quiz",
    #   lti_key: "word2quiz",
    #   lti_secret: secrets.quiz_converter_lti_secret,
    #   site_url: lti_consumer_uri,
    #   canvas_token: secrets.canvas_token,
    #   domain: "word2quiz.#{secrets.domain_name}",
    #   lti_type: ApplicationInstance.lti_types[:course_navigation],
    # }],
  },
  {
    key: Application::SURVEYAGGREGATION,
    name: "Survey Aggregation Tool",
    description: "Admin tool to view survey results",
    client_application_name: "survey_tool",
    canvas_api_permissions: {
      default: [],
      common: [
        "urn:lti:sysrole:ims/lis/SysAdmin",
        "urn:lti:sysrole:ims/lis/Administrator",
        "urn:lti:instrole:ims/lis/Administrator",
        "urn:lti:role:ims/lis/Instructor",
      ],
    },
    kind: Application.kinds[:lti],
    default_config: {},
    lti_config: {
      title: "Survey Aggregation",
      description: "Survey Aggregation Application",
      privacy_level: "public",
      icon: "oauth_icon.png",
      custom_fields: {
        canvas_course_id: "$Canvas.course.id",
        external_tool_url: "$Canvas.externalTool.url",
      },
      course_navigation: {
        text: "Survey Aggregation",
        visibility: "admins",
      },
    },
    application_instances: [],
    # application_instances: [{
    #   tenant: "surveys",
    #   lti_key: "surveys",
    #   lti_secret: secrets.survey_tool_lti_secret,
    #   site_url: lti_consumer_uri,
    #   canvas_token: secrets.canvas_token,
    #   domain: "surveys.#{secrets.domain_name}",
    #   lti_type: ApplicationInstance.lti_types[:course_navigation],
    # }],
  },
  {
    key: Application::POSTGRADES,
    name: "Post Grades Tool",
    description: "Allows instructor to send Canvas grades to U4SM",
    client_application_name: "post_grades",
    canvas_api_permissions: {
      default: [],
      common: [
        "urn:lti:sysrole:ims/lis/SysAdmin",
        "urn:lti:sysrole:ims/lis/Administrator",
        "urn:lti:instrole:ims/lis/Administrator",
      ],
      LIST_ASSIGNMENTS: [
        "urn:lti:role:ims/lis/Instructor",
      ],
    },
    kind: Application.kinds[:lti],
    default_config: {},
    lti_config: {
      title: "Post Grades",
      description: "Post Grades Application",
      privacy_level: "public",
      icon: "oauth_icon.png",
      custom_fields: {
        canvas_course_id: "$Canvas.course.id",
        external_tool_url: "$Canvas.externalTool.url",
      },
      post_grades: {
        text: "Post Grades",
        visibility: "admins",
      },
    },
    application_instances: [],
  },
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
    site.update_attributes!(attrs)
  else
    Site.create!(attrs)
  end
end

applications.each do |attrs|
  application_instances = attrs.delete(:application_instances)
  if application = Application.find_by(name: attrs[:name]) # TODO update to `find_by(key: attrs[:key])`
    application.update_attributes!(attrs)
  else
    application = Application.create!(attrs)
  end
  setup_application_instances(application, application_instances)
end

## One Off
Bundle.find_each do |bundle|
  bundle_hash = bundles.detect { |b| b[:key] == bundle.key }
  shared_tenant = bundle_hash[:shared_tenant] || bundle.shared_tenant == true
  bundle.update(shared_tenant: shared_tenant)
end
## End One Off

bundles.each do |attrs|
  current_bundle = Bundle.find_or_create_by(key: attrs[:key])
  current_bundle.update!(name: attrs[:name], shared_tenant: attrs[:shared_tenant] == true)

  attrs[:applications].reduce(current_bundle) do |bundle, key|
    app = Application.find_by!(key: key)
    bundle.application_bundles.find_or_create_by(bundle_id: bundle.id, application_id: app.id)
    bundle
  end
end

ApplicationInstance.find_each { |ai| ai.update lti_config: ai.application.lti_config }

begin
  Apartment::Tenant.create Application::AUTH
rescue Apartment::TenantExists
  # Do nothing if the tenant already exists
end
