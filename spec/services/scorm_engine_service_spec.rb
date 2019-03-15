require "rails_helper"
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

describe "launch_course" do
  before(:example) do
    @subject = ScormEngineService.new
    @application_instance = FactoryBot.create(:application_instance)
    @application_instance.update_attributes(config: { "scorm_type" => "engine" })
    @reg = Registration.create(
      lms_user_id: 2,
      application_instance: @application_instance,
      lis_outcome_service_url: Rails.application.secrets.scorm_url,
    )
    @registration = { "format" => "summary",
                      "regid" => @reg.id.to_s,
                      "instanceid" => "0",
                      "complete" => "complete",
                      "success" => "failed",
                      "totaltime" => "19",
                      "score" => "0" }
  end

  it "should return correct launch" do
    api_interface = Rails.application.secrets.scorm_api_path
    scorm_tenant_url = Rails.application.secrets.scorm_url + api_interface + "default"

    registration_url = scorm_tenant_url + "/registrations"
    stub_request(:any, registration_url).to_return(body: "{ \"status\": \"204\" }")

    launch_url = scorm_tenant_url + "/registrations/#{@reg.scorm_registration_id}/launchLink?redirectOnExitUrl="
    launch_route = "/launchLink"
    stub_request(:any, launch_url).to_return(body: "{ \"launchLink\": \"#{launch_route}\" }")

    response = @subject.launch_course(@reg, "")
    expect(response[:response]).to eq(Rails.application.secrets.scorm_url + launch_route)
    expect(response[:status]).to eq(200)
  end
end

describe "registration_scorm_result" do
  before(:example) do
    @subject = ScormEngineService.new
    @application_instance = FactoryBot.create(:application_instance)
    @application_instance.update_attributes(config: { "scorm_type" => "engine" })
    @reg = Registration.create(
      lms_user_id: 2,
      application_instance: @application_instance,
      lis_outcome_service_url: Rails.application.secrets.scorm_url,
    )
    @registration = { "format" => "summary",
                      "regid" => @reg.id.to_s,
                      "instanceid" => "0",
                      "complete" => "complete",
                      "success" => "failed",
                      "totaltime" => "19",
                      "score" => "0" }
  end

  it "should return the correct registration results" do
    api_interface = Rails.application.secrets.scorm_api_path
    scorm_tenant_url = Rails.application.secrets.scorm_url + api_interface + "default"

    registration_url = scorm_tenant_url + "/registrations/#{@reg.scorm_registration_id}/progress"
    stub_request(:any, registration_url).to_return(
      body: "{ \"registrationSuccess\": \"PASSED\", \"id\": \"12\", \"score\": { \"scaled\": \"99\" } }",
    )

    response = @subject.registration_scorm_result(@reg.scorm_registration_id)
    expect(response[:response]["rsp"]["stat"]).to eq("ok")
    expect(response[:response]["rsp"]["registrationreport"]["regid"]).to eq("12")
    expect(response[:response]["rsp"]["registrationreport"]["score"]).to eq("99")
  end

  it "should return the correct registration results" do
    api_interface = Rails.application.secrets.scorm_api_path
    scorm_tenant_url = Rails.application.secrets.scorm_url + api_interface + "default"

    registration_url = scorm_tenant_url + "/registrations/#{@reg.scorm_registration_id}/progress"
    stub_request(:any, registration_url).to_return(
      body: "{ \"registrationSuccess\": \"FAILED\", \"id\": \"12\" }",
    )

    response = @subject.registration_scorm_result(@reg.scorm_registration_id)
    expect(response[:response]["rsp"]["stat"]).to eq("fail")
    expect(response[:response]["rsp"]["registrationreport"]["regid"]).to eq("12")
    expect(response[:response]["rsp"]["registrationreport"]["score"]).to eq("unknown")
  end
end

describe "Scorm Engine Service sync score", type: :controller do
  before(:example) do
    @subject = ScormEngineService.new
    @application_instance = FactoryBot.create(:application_instance)
    @application_instance.update_attributes(config: { "scorm_type" => "engine" })
    @lms_course_id = "1234"
    @scorm_course = create(:scorm_course, scorm_service_id: "3_#{@lms_course_id}")
    @user = create(:user, lms_user_id: 2)
    @context_id = generate(:context_id)
    @reg = Registration.create(
      lms_user_id: @user.lms_user_id,
      application_instance: @application_instance,
      lis_outcome_service_url: Rails.application.secrets.scorm_url,
      lms_course_id: @scorm_course.scorm_service_id,
      context_id: @context_id,
    )
    @user.add_to_role("urn:lti:role:ims/lis/Learner", @context_id)
    @registration = {
      "format" => "summary",
      "regid" => @reg.scorm_registration_id.to_s,
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

describe "sync_courses" do
  it "should sync courses table" do
    lms_course_id = "1234"
    graded_id = "12"
    create(:scorm_course, scorm_service_id: "3_#{lms_course_id}")
    graded_course = create(
      :scorm_course,
      scorm_service_id: "#{graded_id}_#{lms_course_id}",
      grading_type: "pass_fail",
    )
    graded_course.lms_assignment_id = 1
    graded_course.points_possible = 5
    graded_course.save!

    subject = ScormEngineService.new
    result = subject.sync_courses(
      [
        { "id" => graded_course.scorm_service_id, "title" => "The Title" },
        { "id" => "3_#{lms_course_id}", "title" => "The New Title" },
        { "id" => "35_#{68000}", "title" => "meh" },
      ],
      lms_course_id,
    )

    scorm_course_count = ScormCourse.
      where(
        scorm_service_id: ["3_#{lms_course_id}", graded_course.scorm_service_id],
      ).count
    expect(scorm_course_count).to eq 2

    expect(result[0][:lms_assignment_id]).to eq(1)
    expect(result[0][:grading_type]).to eq("pass_fail")
  end
end
