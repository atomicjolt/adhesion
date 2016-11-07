require 'rails_helper'
require 'scorm_cloud'

describe "Scorm Cloud Service" do
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
      ScormCourse.create

      subject = ScormCloudService.new
      subject.sync_courses([
        {
          "id": "2",
          "title": "Golf Explained - Run-time Advanced Calls",
          "versions": "-1",
          "registrations": "0",
          "size": "126651"
        },
        {
          "id": "3",
          "title": "Golf Explained - Run-time Advanced Calls",
          "versions": "-1",
          "registrations": "0",
          "size": "126651"
        }
      ])

     expect(ScormCourse.all.map{|c| c[:id]}).to eq([2,3])
    end
  end
end
