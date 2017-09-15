NuclearSecrets.configure do |config|
  config.required_secrets = {
    admin_name: String,
    admin_email: String,
    admin_password: String,
    encryption_key: String,
    application_name: String,
    application_main_domain: String,
    application_root_domain: String,
    email_provider_username: String,
    email_provider_password: String,
    assets_url: String,
    canvas_url: String,
    canvas_developer_id: Integer,
    auth0_client_id: String,
    auth0_client_secret: String,
    secret_key_base: String,
    secret_token: NilClass,
    canvas_proctor_url: NilClass,
    canvas_developer_key: Integer,
    canvas_token: NilClass,
    scorm_url: String,
    scorm_api_path: String,
    scorm_api_username: String,
    scorm_api_password: String,
    proctor_login_secret: String,
    scorm_lti_secret: String,
    scorm_analytics_lti_secret: String,
    attendance_lti_secret: String,
    quiz_converter_lti_secret: String,
    test_lti_secret: String,
    proctor_tool_lti_secret: String,
    scorm_cloud_app_id: String,
    scorm_cloud_secret_key: String,
  }
end
