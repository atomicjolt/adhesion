# encoding: UTF-8
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

ActiveRecord::Schema.define(version: 20161214195432) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

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
  end

  add_index "authentications", ["provider", "uid"], name: "index_authentications_on_provider_and_uid", using: :btree
  add_index "authentications", ["user_id"], name: "index_authentications_on_user_id", using: :btree

  create_table "courses", force: :cascade do |t|
    t.string   "lms_course_id"
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "courses", ["lms_course_id"], name: "index_courses_on_lms_course_id", using: :btree

  create_table "lti_application_instances", force: :cascade do |t|
    t.integer  "lti_application_id"
    t.string   "lti_key"
    t.string   "lti_secret"
    t.integer  "lti_type",                    default: 0
    t.string   "lti_consumer_uri"
    t.string   "encrypted_canvas_token"
    t.string   "encrypted_canvas_token_salt"
    t.string   "encrypted_canvas_token_iv"
    t.datetime "created_at",                              null: false
    t.datetime "updated_at",                              null: false
  end

  add_index "lti_application_instances", ["lti_application_id"], name: "index_lti_application_instances_on_lti_application_id", using: :btree

  create_table "lti_applications", force: :cascade do |t|
    t.string   "name"
    t.string   "description"
    t.string   "client_application_name"
    t.datetime "created_at",              null: false
    t.datetime "updated_at",              null: false
    t.text     "canvas_api_permissions"
  end

  create_table "nonces", force: :cascade do |t|
    t.string   "nonce"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "nonces", ["nonce"], name: "index_nonces_on_nonce", unique: true, using: :btree

  create_table "permissions", force: :cascade do |t|
    t.integer  "role_id"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "permissions", ["role_id", "user_id"], name: "index_permissions_on_role_id_and_user_id", using: :btree

  create_table "registrations", force: :cascade do |t|
    t.integer  "lms_course_id"
    t.integer  "lms_user_id"
    t.datetime "created_at",                                             null: false
    t.datetime "updated_at",                                             null: false
    t.integer  "status",                                   default: 0
    t.decimal  "score",                                    default: 0.0
    t.text     "lis_result_sourcedid",                     default: ""
    t.text     "lis_outcome_service_url",                  default: ""
    t.integer  "lti_application_instance_id"
    t.text     "encrypted_scorm_cloud_passback_secret_iv"
    t.text     "encrypted_scorm_cloud_passback_secret"
  end

  add_index "registrations", ["lms_course_id"], name: "index_registrations_on_lms_course_id", using: :btree
  add_index "registrations", ["lms_user_id"], name: "index_registrations_on_lms_user_id", using: :btree
  add_index "registrations", ["lti_application_instance_id"], name: "index_registrations_on_lti_application_instance_id", using: :btree

  create_table "roles", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "scorm_courses", force: :cascade do |t|
    t.datetime "created_at",        null: false
    t.datetime "updated_at",        null: false
    t.integer  "lms_assignment_id"
    t.float    "points_possible"
    t.string   "scorm_cloud_id"
  end

  add_index "scorm_courses", ["lms_assignment_id"], name: "index_scorm_courses_on_lms_assignment_id", using: :btree
  add_index "scorm_courses", ["scorm_cloud_id"], name: "index_scorm_courses_on_scorm_cloud_id", unique: true, using: :btree

  create_table "sections", force: :cascade do |t|
    t.integer  "course_id"
    t.string   "lms_section_id"
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "sections", ["course_id"], name: "index_sections_on_course_id", using: :btree
  add_index "sections", ["lms_section_id"], name: "index_sections_on_lms_section_id", using: :btree

  create_table "shared_auths", force: :cascade do |t|
    t.string   "secret"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "user_courses", force: :cascade do |t|
    t.integer "user_id"
    t.integer "course_id"
    t.integer "role_id",    default: 2
    t.integer "section_id"
  end

  add_index "user_courses", ["course_id"], name: "index_user_courses_on_course_id", using: :btree
  add_index "user_courses", ["role_id"], name: "index_user_courses_on_role_id", using: :btree
  add_index "user_courses", ["section_id"], name: "index_user_courses_on_section_id", using: :btree
  add_index "user_courses", ["user_id"], name: "index_user_courses_on_user_id", using: :btree

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
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

end
