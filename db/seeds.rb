if Rails.env.development?
  admin = CreateAdminService.new.call
  puts "CREATED ADMIN USER: " << admin.email
end

secrets = Rails.application.secrets

# Add sites
sites = [
  {
    url: secrets.canvas_url,
    oauth_key: secrets.canvas_developer_id,
    oauth_secret: secrets.canvas_developer_key,
  },
  {
    url: "https://lti-ri.imsglobal.org",
  },
  {
    url: "https://dev1.sakaicloud.com",
  },
  {
    url: "https://blackboard.com",
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
  HELPER_ALL_ACCOUNTS: [],
}

bundles = [
  {
    name: "Proctor Tools",
    key: Application::EXAMS,
    applications: [Application::EXAMS, Application::EXAMPROCTOR],
    shared_tenant: true,
  },
]

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
    name: "SCORM",
    description: "SCORM",
    client_application_name: "scorm",
    canvas_api_permissions: {
      default: [],
      common: [
        "urn:lti:sysrole:ims/lis/SysAdmin",
        "urn:lti:sysrole:ims/lis/Administrator",
        "urn:lti:instrole:ims/lis/Administrator",
        "urn:lti:role:ims/lis/Instructor",
        "urn:lti:role:ims/lis/TeachingAssistant",
        "urn:lti:role:ims/lis/ContentDeveloper",
      ],
      LIST_ASSIGNMENTS_ASSIGNMENTS: [
        "urn:lti:role:ims/lis/Learner",
        "urn:lti:sysrole:ims/lis/User",
      ],
      CREATE_ASSIGNMENT: [],
      DELETE_ASSIGNMENT: [],
      EDIT_ASSIGNMENT: [],
    },
    kind: Application.kinds[:lti],
    default_config: { "scorm_type" => "engine" },
    lti_config: {
      title: "SCORM",
      description: "SCORM Application",
      privacy_level: "public",
      icon: "oauth_icon.png",
      custom_fields: {
        canvas_course_id: "$Canvas.course.id",
        external_tool_url: "$Canvas.externalTool.url",
      },
      course_navigation: {
        text: "SCORM",
        visibility: "admins",
      },
      content_migration: true,
    },
    application_instances: [{
      lti_key: Application::SCORM,
      site_url: secrets.canvas_url,
      canvas_token: secrets.canvas_token,
      domain: "#{Application::SCORM}.#{secrets.application_root_domain}",
    }],
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
        "urn:lti:role:ims/lis/TeachingAssistant",
        "urn:lti:role:ims/lis/ContentDeveloper",
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
    application_instances: [{
      lti_key: Application::ATTENDANCE,
      site_url: secrets.canvas_url,
      canvas_token: secrets.canvas_token,
      domain: "#{Application::ATTENDANCE}.#{secrets.application_root_domain}",
    }],
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
        "urn:lti:role:ims/lis/TeachingAssistant",
        "urn:lti:role:ims/lis/ContentDeveloper",
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
    application_instances: [{
      lti_key: Application::EXAMS,
      site_url: secrets.canvas_url,
      canvas_token: secrets.canvas_token,
      domain: "#{Application::EXAMS}.#{secrets.application_root_domain}",
    }],
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
        "urn:lti:role:ims/lis/TeachingAssistant",
        "urn:lti:role:ims/lis/ContentDeveloper",
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
    application_instances: [{
      tenant: Application::EXAMS,
      lti_key: Application::EXAMPROCTOR,
      site_url: secrets.canvas_url,
      canvas_token: secrets.canvas_token,
      domain: "#{Application::EXAMPROCTOR}.#{secrets.application_root_domain}",
    }],
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
        "urn:lti:role:ims/lis/TeachingAssistant",
        "urn:lti:role:ims/lis/ContentDeveloper",
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
      content_migration: true,
    },
    application_instances: [{
      lti_key: Application::SURVEYAGGREGATION,
      site_url: secrets.canvas_url,
      canvas_token: secrets.canvas_token,
      domain: "#{Application::SURVEYAGGREGATION}.#{secrets.application_root_domain}",
    }],
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
        "urn:lti:role:ims/lis/Instructor",
        "urn:lti:role:ims/lis/TeachingAssistant",
        "urn:lti:role:ims/lis/ContentDeveloper",
      ],
      LIST_ASSIGNMENTS_ASSIGNMENTS: [],
      LIST_ASSIGNMENT_SUBMISSIONS_SECTIONS: [],
      LIST_COURSE_SECTIONS: [],
      LIST_ENROLLMENTS_SECTIONS: [],
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
    application_instances: [{
      lti_key: Application::POSTGRADES,
      site_url: secrets.canvas_url,
      canvas_token: secrets.canvas_token,
      domain: "#{Application::POSTGRADES}.#{secrets.application_root_domain}",
    }],
  },
  {
    key: Application::COURSECOMPLETION,
    name: "Course Completion",
    description: "Tool for indicating a self paced course has been completed",
    client_application_name: "course_completion",
    canvas_api_permissions: {
      default: [],
      common: [],
      LIST_ENROLLMENTS_USERS: [
        "urn:lti:sysrole:ims/lis/SysAdmin",
        "urn:lti:sysrole:ims/lis/Administrator",
        "urn:lti:instrole:ims/lis/Administrator",
        "urn:lti:instrole:ims/lis/Student",
        "urn:lti:role:ims/lis/Instructor",
        "urn:lti:role:ims/lis/Learner",
        "urn:lti:sysrole:ims/lis/User",
      ],
    },
    kind: Application.kinds[:lti],
    default_config: {},
    lti_config: {
      title: "Course Completion",
      description: "Course Completion Application",
      privacy_level: "public",
      icon: "oauth_icon.png",
      custom_fields: {
        canvas_course_id: "$Canvas.course.id",
        external_tool_url: "$Canvas.externalTool.url",
      },
      editor_button: {
        text: "Course Completion",
        visibility: "admins",
        icon_url: "completed-icon.png",
      },
    },
    application_instances: [{
      lti_key: Application::COURSECOMPLETION,
      site_url: secrets.canvas_url,
      canvas_token: secrets.canvas_token,
      domain: "#{Application::COURSECOMPLETION}.#{secrets.application_root_domain}",
    }],
  },
  {
    key: Application::USERTOOL,
    name: "User Tool",
    description: "Tool for managing Canvas users.",
    client_application_name: "user_tool",
    canvas_api_permissions: {
      default: [],
      common: [
        "urn:lti:sysrole:ims/lis/SysAdmin",
        "urn:lti:sysrole:ims/lis/Administrator",
        "urn:lti:instrole:ims/lis/Administrator",
      ],
      GET_SUB_ACCOUNTS_OF_ACCOUNT: [],
      LIST_USERS_IN_ACCOUNT: [],
      EDIT_USER: [],
      EDIT_USER_LOGIN: [],
    },
    kind: Application.kinds[:lti],
    default_config: {},
    lti_config: {
      title: "User Tool",
      description: "User Tool Application",
      privacy_level: "public",
      icon: "oauth_icon.png",
      custom_fields: {
        canvas_course_id: "$Canvas.course.id",
        external_tool_url: "$Canvas.externalTool.url",
      },
      account_navigation: {
        text: "Manage Users",
        visibility: "admins",
      },
    },
    application_instances: [{
      lti_key: Application::USERTOOL,
      site_url: secrets.canvas_url,
      canvas_token: secrets.canvas_token,
      domain: "#{Application::USERTOOL}.#{secrets.application_root_domain}",
    }],
  },
]

def setup_application_instances(application, application_instances)
  puts "*** Seeding Application Instances ***"
  application_instances.each do |attrs|
    site = Site.find_by(url: attrs.delete(:site_url))
    attrs = attrs.merge(site_id: site.id)
    share_instance = attrs.delete(:share_instance)
    lti_deployment_attrs = attrs.delete(:lti_deployments)

    app_inst = application.application_instances.new(attrs)
    if application_instance = application.application_instances.find_by(lti_key: app_inst.key)
      puts "Updating application instance with lti key: #{application_instance.lti_key} for site: #{site.url}"
      # Don't change production lti keys and canvas_token or set keys to nil
      if attrs[:lti_secret].blank?
        attrs.delete(:lti_secret)
        puts "- lti_secret is blank. Not updating value."
      end
      if attrs[:lti_key].blank?
        attrs.delete(:lti_key)
        puts "- lti_key is blank. Not updating value."
      end
      if attrs[:canvas_token].blank?
        attrs.delete(:canvas_token)
        puts "- canvas_token is blank. Not updating value."
      end

      application_instance.update_attributes!(attrs)
    else
      puts "Creating new application instance for site: #{site.url}"
      application_instance = application.application_instances.create!(attrs)
    end

    lti_deployment_attrs&.each do |lti_deployment_attr|
      if found = application_instance.lti_deployments.find_by(deployment_id: lti_deployment_attr[:deployment_id])
        found.update_attributes!(lti_deployment_attr)
      else
        application_instance.lti_deployments.create!(lti_deployment_attr)
      end
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

if Apartment::Tenant.current == "public"
  puts "*** Seeding Sites ***"
  sites.each do |attrs|
    if site = Site.find_by(url: attrs[:url])
      puts "Updating site: #{site.url}"
      attrs.delete(:oauth_key) if attrs[:oauth_key].blank?
      attrs.delete(:oauth_secret) if attrs[:oauth_secret].blank?
      site.update_attributes!(attrs)
    else
      puts "Creating site: #{attrs[:url]}"
      Site.create!(attrs)
    end
  end

  puts "*** Seeding Applications ***"
  applications.each do |attrs|
    application_instances = attrs.delete(:application_instances)
    lti_installs_attrs = attrs.delete(:lti_installs)
    if application = Application.find_by(key: attrs[:key])
      puts "Updating application: #{application.name}"
      application.update_attributes!(attrs)
    else
      puts "Creating application: #{attrs[:name]}"
      application = Application.create!(attrs)
    end
    setup_application_instances(application, application_instances)

    lti_installs_attrs&.each do |lti_install_attrs|
      if lti_install = application.lti_installs.find_by(
        iss: lti_install_attrs[:iss],
        client_id: lti_install_attrs[:client_id],
      )
        lti_install.update_attributes!(lti_install_attrs)
      else
        application.lti_installs.create!(lti_install_attrs)
      end
    end
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

  ApplicationInstance.where(bundle_instance_id: nil).find_each do |instance|
    bundle = Bundle.includes(:applications).by_application_id(instance.application.id).last
    BundleInstance.create(site: instance.site, bundle: bundle)
  end

  BundleInstance.find_each do |bundle_instance|
    site = bundle_instance.site
    bundle_instance.applications.each do |app|
      if instance = app.application_instances.find_by(site: site)
        instance.update(bundle_instance: bundle_instance) if instance.bundle_instance_id.nil?
      end
    end
  end

  begin
    Apartment::Tenant.create Application::AUTH
  rescue Apartment::TenantExists
    # Do nothing if the tenant already exists
  end
end

## ONE-OFF CODE
User.oauth_user.unconfirmed.update_all(confirmed_at: Time.now)
## END ONE-OFF CODE

## Use this to update all the application instances
ApplicationInstance.for_tenant(Apartment::Tenant.current).find_each do |ai|
  Apartment::Tenant.switch(ai.tenant) do
    ScormCourse.where(grading_type: nil).where.not(points_possible: nil).update_all(grading_type: "points")
  end
  ai.update(lti_config: ai.application.lti_config)
end
