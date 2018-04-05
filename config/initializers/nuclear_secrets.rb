# rubocop:disable BlockLength
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
    canvas_developer_key: String,
    canvas_token: String,
    auth0_client_id: String,
    auth0_client_secret: String,
    shared_auth_secret: String,
    secret_key_base: String,
    canvas_proctor_url: String,
    scorm_url: String,
    scorm_api_path: String,
    scorm_api_username: String,
    scorm_api_password: String,
    proctor_login_secret: String,
    scorm_cloud_app_id: String,
    scorm_cloud_secret_key: String,
    u4sm_url: String,
    u4sm_username: String,
    u4sm_password: String,
    storage_mount: String,
    error_email: String,
    shared_sis_auth_secret: String,
  }
end
