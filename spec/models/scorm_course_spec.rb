require "rails_helper"

RSpec.describe ScormCourse, type: :model do
  describe "#set_scorm_course_id" do
    it "sets the scorm_cloud_id" do
      scorm_course = ScormCourse.new
      expect(scorm_course.scorm_cloud_id).to eq(nil)
      scorm_course.save!
      expect(scorm_course.scorm_cloud_id.to_i).to eq(scorm_course.id)
    end
  end
end
