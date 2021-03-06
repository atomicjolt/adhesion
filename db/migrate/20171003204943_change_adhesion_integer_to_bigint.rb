class ChangeAdhesionIntegerToBigint < ActiveRecord::Migration[5.0]
  def up
    change_column :attendances, :id, :bigint
    change_column :exam_requests, :id, :bigint
    change_column :proctor_codes, :id, :bigint
    change_column :registrations, :id, :bigint
    change_column :scorm_activities, :id, :bigint
    change_column :scorm_courses, :id, :bigint
    change_column :scorm_objectives, :id, :bigint
    change_column :section_metadata, :id, :bigint
    change_column :sections, :id, :bigint
    change_column :shared_auths, :id, :bigint
    change_column :testing_centers_accounts, :id, :bigint
    change_column :user_courses, :id, :bigint

    change_column :attendances, :lms_student_id, :bigint
    change_column :attendances, :lms_course_id, :bigint
    change_column :exam_requests, :course_id, :bigint
    change_column :exam_requests, :exam_id, :bigint
    change_column :exam_requests, :student_id, :bigint
    change_column :exam_requests, :testing_center_id, :bigint
    change_column :exam_requests, :opened_by_id, :bigint
    change_column :exam_requests, :unlocked_by_id, :bigint
    change_column :proctor_codes, :assigned_exam_id, :bigint
    change_column :proctor_codes, :proctor_id, :bigint
    change_column :registrations, :lms_user_id, :bigint
    change_column :registrations, :application_instance_id, :bigint
    change_column :scorm_activities, :registration_id, :bigint
    change_column :scorm_activities, :lms_user_id, :bigint
    change_column :scorm_activities, :parent_activity_id, :bigint
    change_column :scorm_courses, :lms_assignment_id, :bigint
    change_column :scorm_courses, :file_id, :bigint
    change_column :scorm_objectives, :scorm_activity_id, :bigint
    change_column :section_metadata, :lms_course_id, :bigint
    change_column :section_metadata, :lms_section_id, :bigint
    change_column :sections, :course_id, :bigint
    change_column :testing_centers_accounts, :testing_centers_account_id, :bigint
    change_column :user_courses, :user_id, :bigint
    change_column :user_courses, :course_id, :bigint
    change_column :user_courses, :role_id, :bigint
    change_column :user_courses, :section_id, :bigint
  end

  def down
    change_column :attendances, :id, :integer
    change_column :exam_requests, :id, :integer
    change_column :proctor_codes, :id, :integer
    change_column :registrations, :id, :integer
    change_column :scorm_activities, :id, :integer
    change_column :scorm_courses, :id, :integer
    change_column :scorm_objectives, :id, :integer
    change_column :section_metadata, :id, :integer
    change_column :sections, :id, :integer
    change_column :shared_auths, :id, :integer
    change_column :testing_centers_accounts, :id, :integer
    change_column :user_courses, :id, :integer

    change_column :attendances, :lms_student_id, :integer
    change_column :attendances, :lms_course_id, :integer
    change_column :exam_requests, :course_id, :integer
    change_column :exam_requests, :exam_id, :integer
    change_column :exam_requests, :student_id, :integer
    change_column :exam_requests, :testing_center_id, :integer
    change_column :exam_requests, :opened_by_id, :integer
    change_column :exam_requests, :unlocked_by_id, :integer
    change_column :proctor_codes, :assigned_exam_id, :integer
    change_column :proctor_codes, :proctor_id, :integer
    change_column :registrations, :lms_user_id, :integer
    change_column :registrations, :application_instance_id, :integer
    change_column :scorm_activities, :registration_id, :integer
    change_column :scorm_activities, :lms_user_id, :integer
    change_column :scorm_activities, :parent_activity_id, :integer
    change_column :scorm_courses, :lms_assignment_id, :integer
    change_column :scorm_courses, :file_id, :integer
    change_column :scorm_objectives, :scorm_activity_id, :integer
    change_column :section_metadata, :lms_course_id, :integer
    change_column :section_metadata, :lms_section_id, :integer
    change_column :sections, :course_id, :integer
    change_column :testing_centers_accounts, :testing_centers_account_id, :integer
    change_column :user_courses, :user_id, :integer
    change_column :user_courses, :course_id, :integer
    change_column :user_courses, :role_id, :integer
    change_column :user_courses, :section_id, :integer
  end
end
