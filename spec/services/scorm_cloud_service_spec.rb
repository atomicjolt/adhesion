require 'rails_helper'
require 'scorm_cloud'

  class MockCourse
    attr_accessor :id
    attr_accessor :title
    def initialize(id)
      @id = id
      @title = ""
    end
  end

Rspec.describe "Scorm Cloud Service" do
  before(:example) do
  end


  it "should handle scorm cloud exception" do
    subject = ScormCloudService.new
    result = subject.scorm_cloud_request do
      raise ScormCloud::InvalidPackageError.new
    end
  end

  it "should run failure handler when exception is thrown" do
    subject = ScormCloudService.new
    ran = false
    handle_failure = Proc.new { ran = true }
    result = subject.scorm_cloud_request(handle_failure) do
      raise ScormCloud::InvalidPackageError.new
    end

    expect(ran).to eq true
  end

  it "should not call failure hanlder if it doesnt exist" do
    subject = ScormCloudService.new
    ran = false
    handle_failure = Proc.new { ran = true }
    result = subject.scorm_cloud_request do
      raise ScormCloud::InvalidPackageError.new
    end

    expect(ran).to eq false
  end

  it "should return hash with proper signature" do
    subject = ScormCloudService.new
    result = subject.scorm_cloud_request do
      true
    end
    expected_result = {status: 200, response: true}
    expect(result).to eq expected_result
  end

  describe "sync_courses" do
    it "should sync courses table" do

      ScormCourse.create
      graded_course = ScormCourse.create
      graded_course.scorm_cloud_id = "9"
      graded_course.lms_assignment_id = 1
      graded_course.points_possible = 5
      graded_course.save!

      subject = ScormCloudService.new
      result = subject.sync_courses(
        [
          MockCourse.new("9"),
          MockCourse.new("3"),
        ],
      )

      expect(ScormCourse.all.map { |c| c[:scorm_cloud_id] }).to eq(["9", "3"])
      expect(result[0][:lms_assignment_id]).to eq(1)
      expect(result[0][:is_graded]).to eq("GRADED")
    end
  end
end
