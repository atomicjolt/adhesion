require "rails_helper"

RSpec.describe Course, type: :model do
  describe "create_on_tenant" do
    it "creates a Course on a given tenant" do
      @site = create(:site)
      @name = "An Example application"
      @key = "example"
      @application = create(:application, name: @name, key: @key)
      lti_key = "atomic-key"
      @application_instance = create(
        :application_instance,
        lti_key: lti_key,
        site: @site,
        application: @application,
      )
      canvas_course = create(:canvas_course)
      @course = Course.create_on_tenant(
        @application_instance.tenant,
        canvas_course.lms_course_id,
      )
      Apartment::Tenant.switch(@application_instance.tenant) do
        cc = Course.find_by lms_course_id: canvas_course.lms_course_id
        expect(cc).to eq(@course)
      end
    end
  end
end
