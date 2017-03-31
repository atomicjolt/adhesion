require "rails_helper"

RSpec.describe ScormCourse, type: :model do
  describe "#set_scorm_service_id" do
    it "sets the scorm_service_id" do
      scorm_course = ScormCourse.new
      expect(scorm_course.scorm_service_id).to eq(nil)
      scorm_course.save!
      expect(scorm_course.scorm_service_id).to eq(scorm_course.id.to_s)
    end
  end
end
