FactoryBot.define do
  factory :canvas_user_change do
    admin_making_changes_lms_id { FactoryBot.generate(:lms_user_id) }
    user_being_changed_lms_id { FactoryBot.generate(:lms_user_id) }

    previous_name = FactoryBot.generate(:student_name)
    previous_email = FactoryBot.generate(:email)
    previous_sis_user_id = FactoryBot.generate(:sis_user_id)

    name do
      { previous_value: previous_name, new_value: "#{previous_name}_updated", success: true }
    end

    login_id do
      { previous_value: previous_email, new_value: "updated_#{previous_email}", success: true }
    end

    password do
      { previous_value: "[FILTERED]", new_value: "[FILTERED]", success: true }
    end

    sis_user_id do
      {
        previous_value: previous_sis_user_id,
        new_value: "#{previous_sis_user_id}_updated",
        success: true,
      }
    end

    email do
      { previous_value: previous_email, new_value: "updated_#{previous_email}", success: true }
    end
  end
end
