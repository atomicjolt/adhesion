require "rails_helper"
require "scorm_cloud"
require "ajims/lti"

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
    @application_instance = FactoryBot.create(:application_instance)
    @application_instance.update_attributes(config: { "scorm_type" => "cloud" })
    scorm_course = create(:scorm_course)
    @user = create(:user, lms_user_id: 2)
    @context_id = generate(:context_id)
    @reg = Registration.create(
      lms_user_id: @user.lms_user_id,
      application_instance: @application_instance,
      lis_outcome_service_url: "http://cloud.scorm.com/this?isaspec",
      scorm_course: scorm_course,
      context_id: @context_id,
    )
    @user.add_to_role("urn:lti:role:ims/lis/Learner", @context_id)
    @registration = {
      "format" => "summary",
      "regid" => @reg.scorm_registration_id,
      "instanceid" => "0",
      "complete" => "complete",
      "success" => "failed",
      "totaltime" => "19",
      "score" => "0",
      "learner" => {
        "id" => @user.lms_user_id,
      },
    }
  end

  it "should sync the registration score" do
    allow_any_instance_of(AJIMS::LTI::ToolProvider).to receive(
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
    allow_any_instance_of(AJIMS::LTI::ToolProvider).to receive(
      :post_replace_result!,
    ).and_return(mock_tool)
    @registration["score"] = "50"
    expect { @subject.sync_registration_score(@registration) }.to raise_error(
      "A processing error has occurred",
    )
  end

  it "raises an error" do
    mock_tool = MockTool.new(false, false, true)
    allow_any_instance_of(AJIMS::LTI::ToolProvider).to receive(
      :post_replace_result!,
    ).and_return(mock_tool)
    @registration["score"] = "50"
    expect { @subject.sync_registration_score(@registration) }.to raise_error(
      "Not supported",
    )
  end

  it "raises an error" do
    mock_tool = MockTool.new(false)
    allow_any_instance_of(AJIMS::LTI::ToolProvider).to receive(
      :post_replace_result!,
    ).and_return(mock_tool)
    @registration["score"] = "50"
    expect { @subject.sync_registration_score(@registration) }.to raise_error(
      Adhesion::Exceptions::PostResultsToLms,
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
  before do
    @lms_course_id = "1234"
    @course1 = create(
      :scorm_course,
      scorm_service_id: "3_#{@lms_course_id}",
      import_job_status: ScormCourse::COMPLETE,
    )
    @course2 = create(
      :scorm_course,
      scorm_service_id: "4_#{@lms_course_id}",
      import_job_status: ScormCourse::COMPLETE,
    )
    @graded_course = create(
      :scorm_course,
      scorm_service_id: "12_#{@lms_course_id}",
      grading_type: "pass_fail",
      import_job_status: ScormCourse::COMPLETE,
    )
    @graded_course.lms_assignment_id = 1
    @graded_course.points_possible = 5
    @graded_course.save!

    @missing_course_service_id = "35_#{@lms_course_id}"

    subject = ScormCloudService.new
    @result = subject.sync_courses(
      [
        MockCourse.new(@graded_course.scorm_service_id),
        MockCourse.new(@course1.scorm_service_id),
        MockCourse.new(@missing_course_service_id),
      ],
      @lms_course_id,
    )
  end

  it "should sync cloud courses table" do
    scorm_course_count = ScormCourse.
      where(
        scorm_service_id: [@course1.scorm_service_id, @graded_course.scorm_service_id],
      ).count
    expect(scorm_course_count).to eq 2

    expect(@result[0][:lms_assignment_id]).to eq(1)
    expect(@result[0][:grading_type]).to eq("pass_fail")
  end

  it "should create missing courses" do
    new_scorm_course_count = ScormCourse.
      where(
        scorm_service_id: @missing_course_service_id,
      ).count
    expect(new_scorm_course_count).to eq 1
  end

  it "should delete extra courses" do
    deleted_courses_count = ScormCourse.
      where(
        scorm_service_id: @course2.scorm_service_id,
      ).count
    expect(deleted_courses_count).to eq(0)
  end
end
