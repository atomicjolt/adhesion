class Course < ApplicationRecord
  has_many :authentications, dependent: :destroy, inverse_of: :course

  def self.create_on_tenant(tenant, course_id)
    Apartment::Tenant.switch(tenant) do
      Course.find_or_create_by(
        lms_course_id: course_id,
      )
    end
  end
end
