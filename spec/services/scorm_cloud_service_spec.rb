require "rails_helper"
require "scorm_cloud"

class MockCourse
  attr_accessor :id
  attr_accessor :title
  def initialize(id)
    @id = id
    @title = ""
  end
end

class MockTool
  def initialize(success = true, processing = false, unsupported = false)
    @success = success
    @processing = processing
    @unsupported = unsupported
  end

  def success?
    @success
  end

  def processing?
    @processing
  end

  def unsupported?
    @unsupported
  end
end

describe "Scorm Cloud Service sync score", type: :controller do
  before(:example) do
    @subject = ScormCloudService.new
    @application_instance = FactoryGirl.create(:application_instance)
    @reg = Registration.create(
      lms_user_id: 2,
      application_instance: @application_instance,
      lis_outcome_service_url: "http://cloud.scorm.com/this?isaspec",
    )
    @registration = { "format" => "summary",
                      "regid" => @reg.scorm_registration_id,
                      "instanceid" => "0",
                      "complete" => "complete",
                      "success" => "failed",
                      "totaltime" => "19",
                      "score" => "0" }
  end

  it "should sync the registration score" do
    allow_any_instance_of(IMS::LTI::ToolProvider).to receive(
      :post_replace_result!,
    ).and_return(MockTool.new)
    @subject.sync_registration_score(@registration)
    expect(@reg.score).to eq(@registration["score"].to_f)
    @registration["score"] = "50"
    @subject.sync_registration_score(@registration)
    reg = Registration.find_by(scorm_registration_id: @reg.scorm_registration_id)
    expect(reg.score).to eq(@registration["score"].to_f / 100)
  end

  it "raises an error" do
    mock_tool = MockTool.new(false, true)
    allow_any_instance_of(IMS::LTI::ToolProvider).to receive(
      :post_replace_result!,
    ).and_return(mock_tool)
    @subject.sync_registration_score(@registration)
    @registration["score"] = "50"
    expect { @subject.sync_registration_score(@registration) }.to raise_error(
      "A processing error has occurred",
    )
  end

  it "raises an error" do
    mock_tool = MockTool.new(false, false, true)
    allow_any_instance_of(IMS::LTI::ToolProvider).to receive(
      :post_replace_result!,
    ).and_return(mock_tool)
    @subject.sync_registration_score(@registration)
    @registration["score"] = "50"
    expect { @subject.sync_registration_score(@registration) }.to raise_error(
      "Not supported",
    )
  end

  it "raises an error" do
    mock_tool = MockTool.new(false)
    allow_any_instance_of(IMS::LTI::ToolProvider).to receive(
      :post_replace_result!,
    ).and_return(mock_tool)
    @subject.sync_registration_score(@registration)
    @registration["score"] = "50"
    expect { @subject.sync_registration_score(@registration) }.to raise_error(
      "A failure has occurred. Please try again.",
    )
  end
end

describe "ScormCloudService" do
  before(:example) do
    @subject = ScormCloudService.new
  end

  it "should handle scorm cloud exception" do
    result = @subject.scorm_cloud_request do
      raise ScormCloud::InvalidPackageError.new
    end
    expect(result).to_not be(nil)
  end

  it "should run failure handler when exception is thrown" do
    ran = false
    handle_failure = Proc.new { ran = true }
    @subject.scorm_cloud_request(handle_failure) do
      raise ScormCloud::InvalidPackageError.new
    end
    expect(ran).to eq true
  end

  it "should not call failure handler if it doesnt exist" do
    ran = false
    @subject.scorm_cloud_request do
      raise ScormCloud::InvalidPackageError.new
    end
    expect(ran).to eq false
  end
end

describe "Hash handler" do
  it "should return hash with proper signature" do
    @subject = ScormCloudService.new
    result = @subject.scorm_cloud_request do
      true
    end
    expected_result = { status: 200, response: true }
    expect(result).to eq expected_result
  end
end

describe "sync_courses" do
  it "should sync cloud courses table" do
    ScormCourse.create
    graded_course = ScormCourse.create
    graded_course.lms_assignment_id = 1
    graded_course.points_possible = 5
    graded_course.save!

    subject = ScormCloudService.new
    result = subject.sync_courses(
      [
        MockCourse.new(graded_course.scorm_service_id),
        MockCourse.new("3"),
      ],
    )

    courses = ScormCourse.where(scorm_service_id: [graded_course.id, 3])
    expect(courses.count).to eq 2

    expect(result[0][:lms_assignment_id]).to eq(1)
    expect(result[0][:is_graded]).to eq("GRADED")
  end
end
