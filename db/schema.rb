# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_02_26_194920) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "api_tokens", force: :cascade do |t|
    t.string "name"
    t.string "encrypted_token"
    t.string "encrypted_token_salt"
    t.string "encrypted_token_iv"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_api_tokens_on_name"
  end

  create_table "application_bundles", force: :cascade do |t|
    t.bigint "application_id"
    t.bigint "bundle_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["application_id", "bundle_id"], name: "index_application_bundles_on_application_id_and_bundle_id"
  end

  create_table "application_instances", force: :cascade do |t|
    t.bigint "application_id"
    t.string "lti_key"
    t.string "lti_secret"
    t.string "encrypted_canvas_token"
    t.string "encrypted_canvas_token_salt"
    t.string "encrypted_canvas_token_iv"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "domain", limit: 2048
    t.bigint "site_id"
    t.string "tenant"
    t.jsonb "config", default: {}
    t.jsonb "lti_config"
    t.datetime "disabled_at"
    t.bigint "bundle_instance_id"
    t.boolean "anonymous", default: false
    t.boolean "rollbar_enabled", default: true
    t.boolean "use_scoped_developer_key", default: false, null: false
    t.index ["application_id"], name: "index_application_instances_on_application_id"
    t.index ["lti_key"], name: "index_application_instances_on_lti_key"
    t.index ["site_id"], name: "index_application_instances_on_site_id"
  end

  create_table "applications", force: :cascade do |t|
    t.string "name"
    t.string "description"
    t.string "client_application_name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "kind", default: 0
    t.bigint "application_instances_count"
    t.jsonb "default_config", default: {}
    t.jsonb "lti_config"
    t.jsonb "canvas_api_permissions", default: {}
    t.string "key"
    t.string "oauth_precedence", default: "global,user,application_instance,course"
    t.boolean "anonymous", default: false
    t.jsonb "lti_advantage_config", default: {}
    t.boolean "rollbar_enabled", default: true
    t.string "oauth_scopes", default: [], array: true
    t.string "oauth_key"
    t.string "oauth_secret"
    t.index ["key"], name: "index_applications_on_key"
  end

  create_table "atomic_doc_sessions", force: :cascade do |t|
    t.string "session_id"
    t.bigint "atomic_doc_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "expires_at"
    t.index ["session_id"], name: "index_atomic_doc_sessions_on_session_id", unique: true
  end

  create_table "atomic_docs", force: :cascade do |t|
    t.string "url"
    t.string "status"
    t.string "file_path"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["url"], name: "index_atomic_docs_on_url", unique: true
  end

  create_table "attendances", force: :cascade do |t|
    t.bigint "lms_student_id"
    t.bigint "lms_course_id"
    t.date "date"
    t.string "status"
    t.string "name"
    t.string "sortable_name"
    t.index ["lms_course_id", "date", "lms_student_id"], name: "index_attendances_on_lms_course_id_and_date_and_lms_student_id"
    t.index ["lms_course_id", "date", "status"], name: "index_attendances_on_lms_course_id_and_date_and_status"
  end

  create_table "authentications", force: :cascade do |t|
    t.bigint "user_id"
    t.string "provider"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "uid"
    t.string "provider_avatar"
    t.string "username"
    t.string "provider_url", limit: 2048
    t.string "encrypted_token"
    t.string "encrypted_token_salt"
    t.string "encrypted_token_iv"
    t.string "encrypted_secret"
    t.string "encrypted_secret_salt"
    t.string "encrypted_secret_iv"
    t.string "encrypted_refresh_token"
    t.string "encrypted_refresh_token_salt"
    t.string "encrypted_refresh_token_iv"
    t.string "id_token"
    t.string "lti_user_id"
    t.bigint "application_instance_id"
    t.bigint "course_id"
    t.index ["lti_user_id"], name: "index_authentications_on_lti_user_id"
    t.index ["provider", "uid"], name: "index_authentications_on_provider_and_uid"
    t.index ["uid", "provider", "provider_url"], name: "index_authentications_on_uid_and_provider_and_provider_url"
    t.index ["user_id"], name: "index_authentications_on_user_id"
  end

  create_table "bundle_instances", force: :cascade do |t|
    t.bigint "site_id"
    t.bigint "bundle_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "entity_key"
    t.string "id_token"
    t.index ["id_token"], name: "index_bundle_instances_on_id_token"
  end

  create_table "bundles", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "key"
    t.boolean "shared_tenant", default: false
    t.index ["key"], name: "index_bundles_on_key"
  end

  create_table "courses", force: :cascade do |t|
    t.string "lms_course_id"
    t.string "name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["lms_course_id"], name: "index_courses_on_lms_course_id"
  end

  create_table "exam_requests", force: :cascade do |t|
    t.bigint "course_id"
    t.bigint "exam_id"
    t.bigint "student_id"
    t.bigint "testing_center_id"
    t.string "status", default: "requested"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "exam_name"
    t.bigint "opened_by_id"
    t.string "opened_by_name"
    t.string "student_name"
    t.string "course_name"
    t.string "testing_center_name"
    t.string "message"
    t.date "scheduled_date"
    t.string "scheduled_time"
    t.bigint "unlocked_by_id"
    t.string "unlocked_by_name"
  end

  create_table "ims_exports", id: :serial, force: :cascade do |t|
    t.string "token"
    t.string "tool_consumer_instance_guid"
    t.string "context_id"
    t.string "custom_canvas_course_id"
    t.jsonb "payload"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "status", default: "processing"
    t.string "message", limit: 2048
    t.index ["token"], name: "index_ims_exports_on_token"
  end

  create_table "ims_imports", force: :cascade do |t|
    t.string "status", default: "initialized", null: false
    t.string "error_message"
    t.text "error_trace"
    t.string "export_token"
    t.string "context_id", null: false
    t.string "tci_guid", null: false
    t.string "lms_course_id", null: false
    t.string "source_context_id", null: false
    t.string "source_tci_guid", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.jsonb "payload"
  end

  create_table "jwks", force: :cascade do |t|
    t.string "kid"
    t.string "pem"
    t.bigint "application_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["application_id"], name: "index_jwks_on_application_id"
    t.index ["kid"], name: "index_jwks_on_kid"
  end

  create_table "lti_deployments", force: :cascade do |t|
    t.bigint "application_instance_id"
    t.string "deployment_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["application_instance_id"], name: "index_lti_deployments_on_application_instance_id"
    t.index ["deployment_id", "application_instance_id"], name: "index_lti_deployments_on_d_id_and_ai_id", unique: true
    t.index ["deployment_id"], name: "index_lti_deployments_on_deployment_id"
  end

  create_table "lti_installs", force: :cascade do |t|
    t.string "iss"
    t.bigint "application_id"
    t.string "client_id"
    t.string "jwks_url"
    t.string "token_url"
    t.string "oidc_url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["application_id", "iss"], name: "index_lti_installs_on_application_id_and_iss"
    t.index ["application_id"], name: "index_lti_installs_on_application_id"
    t.index ["client_id", "iss"], name: "index_lti_installs_on_client_id_and_iss", unique: true
    t.index ["client_id"], name: "index_lti_installs_on_client_id"
    t.index ["iss"], name: "index_lti_installs_on_iss"
  end

  create_table "lti_launches", force: :cascade do |t|
    t.jsonb "config"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "token"
    t.string "context_id"
    t.string "tool_consumer_instance_guid"
    t.bigint "scorm_course_id"
    t.index ["context_id"], name: "index_lti_launches_on_context_id"
    t.index ["scorm_course_id"], name: "index_lti_launches_on_scorm_course_id"
    t.index ["token", "context_id"], name: "index_lti_launches_on_token_and_context_id", unique: true
  end

  create_table "nonces", force: :cascade do |t|
    t.string "nonce"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["nonce"], name: "index_nonces_on_nonce", unique: true
  end

  create_table "oauth_states", force: :cascade do |t|
    t.string "state"
    t.text "payload"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["state"], name: "index_oauth_states_on_state"
  end

  create_table "open_id_states", force: :cascade do |t|
    t.string "nonce"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["nonce"], name: "index_open_id_states_on_nonce", unique: true
  end

  create_table "permissions", force: :cascade do |t|
    t.bigint "role_id"
    t.bigint "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string "context_id"
    t.index ["context_id"], name: "index_permissions_on_context_id"
    t.index ["role_id", "user_id", "context_id"], name: "index_permissions_on_role_id_and_user_id_and_context_id", unique: true
    t.index ["role_id", "user_id"], name: "index_permissions_on_role_id_and_user_id", unique: true, where: "(context_id IS NULL)"
  end

  create_table "proctor_codes", force: :cascade do |t|
    t.bigint "assigned_exam_id"
    t.string "code"
    t.bigint "proctor_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "que_jobs", primary_key: ["queue", "priority", "run_at", "job_id"], comment: "3", force: :cascade do |t|
    t.integer "priority", limit: 2, default: 100, null: false
    t.datetime "run_at", default: -> { "now()" }, null: false
    t.bigserial "job_id", null: false
    t.text "job_class", null: false
    t.json "args", default: [], null: false
    t.integer "error_count", default: 0, null: false
    t.text "last_error"
    t.text "queue", default: "", null: false
  end

  create_table "registrations", force: :cascade do |t|
    t.string "lms_course_id"
    t.bigint "lms_user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "status"
    t.decimal "score", default: "0.0"
    t.text "lis_result_sourcedid", default: ""
    t.text "lis_outcome_service_url", default: ""
    t.bigint "application_instance_id"
    t.text "encrypted_scorm_cloud_passback_secret_iv"
    t.text "encrypted_scorm_cloud_passback_secret"
    t.string "scorm_registration_id"
    t.string "context_id"
    t.index ["application_instance_id"], name: "index_registrations_on_application_instance_id"
    t.index ["lms_course_id", "lms_user_id", "context_id"], name: "index_registrations_on_lms_course_id_lms_user_id_context_id"
    t.index ["lms_course_id"], name: "index_registrations_on_lms_course_id"
    t.index ["lms_user_id"], name: "index_registrations_on_lms_user_id"
    t.index ["scorm_registration_id"], name: "index_registrations_on_scorm_registration_id"
  end

  create_table "request_statistics", primary_key: ["truncated_time", "tenant"], force: :cascade do |t|
    t.datetime "truncated_time", null: false
    t.string "tenant", null: false
    t.integer "number_of_hits", default: 1
    t.integer "number_of_lti_launches", default: 0
    t.integer "number_of_errors", default: 0
  end

  create_table "request_user_statistics", primary_key: ["truncated_time", "tenant", "user_id"], force: :cascade do |t|
    t.datetime "truncated_time", null: false
    t.string "tenant", null: false
    t.bigint "user_id", null: false
  end

  create_table "roles", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "scorm_activities", force: :cascade do |t|
    t.string "title"
    t.bigint "registration_id"
    t.boolean "satisfied"
    t.boolean "completed"
    t.integer "attempts"
    t.boolean "suspended"
    t.string "completion_status"
    t.float "score_scaled"
    t.float "score_raw"
    t.float "score_min"
    t.float "score_max"
    t.string "success_status"
    t.bigint "lms_user_id"
    t.string "lms_user_name"
    t.bigint "parent_activity_id"
    t.integer "total_time"
    t.integer "time_tracked"
    t.string "activity_id"
    t.boolean "latest_attempt"
    t.integer "depth"
    t.index ["registration_id", "activity_id", "title", "attempts"], name: "index_scorm_activities_on_reg_id_activity_id_title_attempt"
    t.index ["registration_id", "activity_id", "title", "latest_attempt"], name: "index_scorm_activities_on_reg_id_act_id_title_latest_attempt"
    t.index ["registration_id", "latest_attempt"], name: "index_scorm_activities_on_registration_id_and_latest_attempt"
    t.index ["registration_id"], name: "index_scorm_activities_on_registration_id"
    t.index ["title"], name: "index_scorm_activities_on_title"
  end

  create_table "scorm_courses", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "lms_assignment_id"
    t.float "points_possible"
    t.string "scorm_service_id"
    t.string "title"
    t.bigint "file_id"
    t.string "import_job_status"
    t.string "resource_link_id"
    t.text "message"
    t.string "grading_type"
    t.index ["lms_assignment_id"], name: "index_scorm_courses_on_lms_assignment_id"
    t.index ["scorm_service_id"], name: "index_scorm_courses_on_scorm_service_id", unique: true
  end

  create_table "scorm_objectives", force: :cascade do |t|
    t.bigint "scorm_activity_id"
    t.boolean "primary"
    t.boolean "measure_status"
    t.float "normalized_measure"
    t.boolean "progress_status"
    t.boolean "satisfied_status"
    t.index ["scorm_activity_id"], name: "index_scorm_objectives_on_scorm_activity_id"
  end

  create_table "section_metadata", force: :cascade do |t|
    t.bigint "lms_course_id"
    t.bigint "lms_section_id"
    t.boolean "any_posted"
    t.datetime "mid_posted"
    t.datetime "final_posted"
  end

  create_table "sections", force: :cascade do |t|
    t.bigint "course_id"
    t.string "lms_section_id"
    t.string "name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["course_id"], name: "index_sections_on_course_id"
    t.index ["lms_section_id"], name: "index_sections_on_lms_section_id"
  end

  create_table "shared_auths", force: :cascade do |t|
    t.string "secret"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "sis_grades", id: :serial, force: :cascade do |t|
    t.string "sis_course_id"
    t.string "sis_section_id"
    t.string "sis_user_id"
    t.string "gradetype"
    t.jsonb "grades", default: []
    t.datetime "created_at", null: false
    t.index ["created_at", "gradetype", "sis_course_id", "sis_section_id", "sis_user_id"], name: "index_sis_grades_on_created_at_gradetype_course_section_user"
    t.index ["gradetype", "sis_course_id", "sis_section_id", "sis_user_id"], name: "index_sis_grades_on_gradetype_course_section_user"
  end

  create_table "sites", force: :cascade do |t|
    t.string "url", limit: 2048
    t.string "oauth_key"
    t.string "oauth_secret"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "secret"
    t.index ["url"], name: "index_sites_on_url"
  end

  create_table "testing_centers_accounts", force: :cascade do |t|
    t.string "canvas_instance_name"
    t.bigint "testing_centers_account_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "user_courses", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "course_id"
    t.bigint "role_id", default: 2
    t.bigint "section_id"
    t.index ["course_id"], name: "index_user_courses_on_course_id"
    t.index ["role_id"], name: "index_user_courses_on_role_id"
    t.index ["section_id"], name: "index_user_courses_on_section_id"
    t.index ["user_id"], name: "index_user_courses_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.bigint "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string "name"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.string "password_salt"
    t.string "lti_user_id"
    t.string "lti_provider"
    t.string "lms_user_id"
    t.bigint "create_method", default: 0
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["lms_user_id", "lti_user_id"], name: "index_users_on_lms_user_id_and_lti_user_id"
    t.index ["lti_user_id"], name: "index_users_on_lti_user_id", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

end
