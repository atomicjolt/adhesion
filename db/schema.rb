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

ActiveRecord::Schema.define(version: 20170808145111) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "application_bundles", force: :cascade do |t|
    t.integer  "application_id"
    t.integer  "bundle_id"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
    t.index ["application_id", "bundle_id"], name: "index_application_bundles_on_application_id_and_bundle_id", using: :btree
  end

  create_table "application_instances", force: :cascade do |t|
    t.integer  "application_id"
    t.string   "lti_key"
    t.string   "lti_secret"
    t.string   "encrypted_canvas_token"
    t.string   "encrypted_canvas_token_salt"
    t.string   "encrypted_canvas_token_iv"
    t.datetime "created_at",                                            null: false
    t.datetime "updated_at",                                            null: false
    t.string   "domain",                      limit: 2048
    t.integer  "site_id"
    t.string   "tenant"
    t.jsonb    "config",                                   default: {}
    t.jsonb    "lti_config"
    t.datetime "disabled_at"
    t.integer  "bundle_instance_id"
    t.index ["application_id"], name: "index_application_instances_on_application_id", using: :btree
    t.index ["lti_key"], name: "index_application_instances_on_lti_key", using: :btree
    t.index ["site_id"], name: "index_application_instances_on_site_id", using: :btree
  end

  create_table "applications", force: :cascade do |t|
    t.string   "name"
    t.string   "description"
    t.string   "client_application_name"
    t.datetime "created_at",                               null: false
    t.datetime "updated_at",                               null: false
    t.integer  "kind",                        default: 0
    t.integer  "application_instances_count"
    t.jsonb    "default_config",              default: {}
    t.jsonb    "lti_config"
    t.jsonb    "canvas_api_permissions",      default: {}
    t.string   "key"
    t.index ["key"], name: "index_applications_on_key", using: :btree
  end

  create_table "attendances", force: :cascade do |t|
    t.integer "lms_student_id"
    t.integer "lms_course_id"
    t.date    "date"
    t.string  "status"
    t.string  "name"
    t.string  "sortable_name"
  end

  create_table "authentications", force: :cascade do |t|
    t.integer  "user_id"
    t.string   "provider"
    t.datetime "created_at",                                null: false
    t.datetime "updated_at",                                null: false
    t.text     "json_response"
    t.string   "uid"
    t.string   "provider_avatar"
    t.string   "username"
    t.string   "provider_url",                 limit: 2048
    t.string   "encrypted_token"
    t.string   "encrypted_token_salt"
    t.string   "encrypted_token_iv"
    t.string   "encrypted_secret"
    t.string   "encrypted_secret_salt"
    t.string   "encrypted_secret_iv"
    t.string   "encrypted_refresh_token"
    t.string   "encrypted_refresh_token_salt"
    t.string   "encrypted_refresh_token_iv"
    t.string   "id_token"
    t.index ["provider", "uid"], name: "index_authentications_on_provider_and_uid", using: :btree
    t.index ["user_id"], name: "index_authentications_on_user_id", using: :btree
  end

  create_table "bundle_instances", force: :cascade do |t|
    t.integer  "site_id"
    t.integer  "bundle_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string   "entity_key"
    t.string   "id_token"
    t.index ["id_token"], name: "index_bundle_instances_on_id_token", using: :btree
  end

  create_table "bundles", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string   "key"
    t.index ["key"], name: "index_bundles_on_key", using: :btree
  end

  create_table "courses", force: :cascade do |t|
    t.string   "lms_course_id"
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["lms_course_id"], name: "index_courses_on_lms_course_id", using: :btree
  end

  create_table "exam_requests", force: :cascade do |t|
    t.integer  "course_id"
    t.integer  "exam_id"
    t.integer  "student_id"
    t.integer  "testing_center_id"
    t.string   "status",              default: "requested"
    t.datetime "created_at",                                null: false
    t.datetime "updated_at",                                null: false
    t.string   "exam_name"
    t.integer  "opened_by_id"
    t.string   "opened_by_name"
    t.string   "student_name"
    t.string   "course_name"
    t.string   "testing_center_name"
    t.string   "message"
    t.date     "scheduled_date"
    t.string   "scheduled_time"
    t.integer  "unlocked_by_id"
    t.string   "unlocked_by_name"
  end

  create_table "lti_launches", force: :cascade do |t|
    t.jsonb    "config"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string   "token"
    t.index ["token"], name: "index_lti_launches_on_token", unique: true, using: :btree
  end

  create_table "nonces", force: :cascade do |t|
    t.string   "nonce"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["nonce"], name: "index_nonces_on_nonce", unique: true, using: :btree
  end

  create_table "oauth_states", force: :cascade do |t|
    t.string   "state"
    t.text     "payload"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["state"], name: "index_oauth_states_on_state", using: :btree
  end

  create_table "permissions", force: :cascade do |t|
    t.integer  "role_id"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "context_id"
    t.index ["context_id"], name: "index_permissions_on_context_id", using: :btree
    t.index ["role_id", "user_id", "context_id"], name: "index_permissions_on_role_id_and_user_id_and_context_id", using: :btree
    t.index ["role_id", "user_id"], name: "index_permissions_on_role_id_and_user_id", using: :btree
  end

  create_table "proctor_codes", force: :cascade do |t|
    t.integer  "assigned_exam_id"
    t.string   "code"
    t.integer  "proctor_id"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
  end

  create_table "registrations", force: :cascade do |t|
    t.string   "lms_course_id"
    t.integer  "lms_user_id"
    t.datetime "created_at",                                               null: false
    t.datetime "updated_at",                                               null: false
    t.integer  "status",                                   default: 0
    t.decimal  "score",                                    default: "0.0"
    t.text     "lis_result_sourcedid",                     default: ""
    t.text     "lis_outcome_service_url",                  default: ""
    t.integer  "application_instance_id"
    t.text     "encrypted_scorm_cloud_passback_secret_iv"
    t.text     "encrypted_scorm_cloud_passback_secret"
    t.string   "scorm_registration_id"
    t.index ["application_instance_id"], name: "index_registrations_on_application_instance_id", using: :btree
    t.index ["lms_course_id", "lms_user_id"], name: "index_registrations_on_lms_course_id_and_lms_user_id", using: :btree
    t.index ["lms_course_id"], name: "index_registrations_on_lms_course_id", using: :btree
    t.index ["lms_user_id"], name: "index_registrations_on_lms_user_id", using: :btree
    t.index ["scorm_registration_id"], name: "index_registrations_on_scorm_registration_id", using: :btree
  end

  create_table "roles", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "scorm_activities", force: :cascade do |t|
    t.string  "title"
    t.integer "registration_id"
    t.boolean "satisfied"
    t.boolean "completed"
    t.integer "attempts"
    t.boolean "suspended"
    t.string  "completion_status"
    t.float   "score_scaled"
    t.float   "score_raw"
    t.float   "score_min"
    t.float   "score_max"
    t.string  "success_status"
    t.integer "lms_user_id"
    t.string  "lms_user_name"
    t.integer "parent_activity_id"
    t.integer "total_time"
    t.integer "time_tracked"
    t.string  "activity_id"
    t.boolean "latest_attempt"
    t.integer "depth"
    t.index ["registration_id", "activity_id", "title", "attempts"], name: "index_scorm_activities_on_reg_id_activity_id_title_attempt", using: :btree
    t.index ["registration_id", "activity_id", "title", "latest_attempt"], name: "index_scorm_activities_on_reg_id_act_id_title_latest_attempt", using: :btree
    t.index ["registration_id", "latest_attempt"], name: "index_scorm_activities_on_registration_id_and_latest_attempt", using: :btree
    t.index ["registration_id"], name: "index_scorm_activities_on_registration_id", using: :btree
    t.index ["title"], name: "index_scorm_activities_on_title", using: :btree
  end

  create_table "scorm_courses", force: :cascade do |t|
    t.datetime "created_at",        null: false
    t.datetime "updated_at",        null: false
    t.integer  "lms_assignment_id"
    t.float    "points_possible"
    t.string   "scorm_service_id"
    t.string   "title"
    t.integer  "file_id"
    t.index ["lms_assignment_id"], name: "index_scorm_courses_on_lms_assignment_id", using: :btree
    t.index ["scorm_service_id"], name: "index_scorm_courses_on_scorm_service_id", unique: true, using: :btree
  end

  create_table "scorm_objectives", force: :cascade do |t|
    t.integer "scorm_activity_id"
    t.boolean "primary"
    t.boolean "measure_status"
    t.float   "normalized_measure"
    t.boolean "progress_status"
    t.boolean "satisfied_status"
    t.index ["scorm_activity_id"], name: "index_scorm_objectives_on_scorm_activity_id", using: :btree
  end

  create_table "sections", force: :cascade do |t|
    t.integer  "course_id"
    t.string   "lms_section_id"
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["course_id"], name: "index_sections_on_course_id", using: :btree
    t.index ["lms_section_id"], name: "index_sections_on_lms_section_id", using: :btree
  end

  create_table "shared_auths", force: :cascade do |t|
    t.string   "secret"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "sites", force: :cascade do |t|
    t.string   "url",          limit: 2048
    t.string   "oauth_key"
    t.string   "oauth_secret"
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
    t.string   "secret"
    t.index ["url"], name: "index_sites_on_url", using: :btree
  end

  create_table "testing_centers_accounts", force: :cascade do |t|
    t.string   "canvas_instance_name"
    t.integer  "testing_centers_account_id"
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
  end

  create_table "user_courses", force: :cascade do |t|
    t.integer "user_id"
    t.integer "course_id"
    t.integer "role_id",    default: 2
    t.integer "section_id"
    t.index ["course_id"], name: "index_user_courses_on_course_id", using: :btree
    t.index ["role_id"], name: "index_user_courses_on_role_id", using: :btree
    t.index ["section_id"], name: "index_user_courses_on_section_id", using: :btree
    t.index ["user_id"], name: "index_user_courses_on_user_id", using: :btree
  end

  create_table "users", force: :cascade do |t|
    t.string   "email",                  default: "",    null: false
    t.string   "encrypted_password",     default: "",    null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,     null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "name"
    t.string   "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string   "unconfirmed_email"
    t.string   "time_zone",              default: "UTC"
    t.string   "password_salt"
    t.string   "lti_user_id"
    t.string   "lti_provider"
    t.string   "lms_user_id"
    t.integer  "create_method",          default: 0
    t.index ["email"], name: "index_users_on_email", unique: true, using: :btree
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree
  end

end
