require "rails_helper"

RSpec.describe ImsExportJob, type: :job do
  include ActiveJob::TestHelper

  before do
    setup_application_instance
  end

  after do
    clear_enqueued_jobs
  end

  subject { ImsExportJob }

  let(:export) do
    create(
      :ims_export,
      payload: {
        lti_launches: [],
        lti_tools: [],
        ims_export_token: nil,
      },
    )
  end

  let(:ims_export_params) do
    {
      context_id: "123",
      tool_consumer_instance_guid: "abc",
      custom_canvas_course_id: "1331",
    }
  end

  let(:scorm_course) { create(:scorm_course) }

  let(:config) do
    {
      "lms_course_id": "1331",
      "scorm_course_id": scorm_course.id,
      "scorm_service_id": "#{scorm_course.id}_1331",
    }
  end

  let(:lti_launch) { create(:lti_launch, context_id: "123", config: config) }

  it "Collects the lti launches" do
    expect(export.payload["lti_launches"]).to_not include(lti_launch)
    subject.perform_now(export, @application_instance, ims_export_params.to_json)
    expect(export.payload["lti_launches"].count).to eq(1)
    ll = export.payload["lti_launches"].first
    expect(ll["token"]).to include(lti_launch.token)
    expect(ll["scorm_course"]["grading_type"]).to eq(scorm_course.grading_type)
    expect(ll["scorm_course"]["title"]).to eq(scorm_course.title)
    expect(ll["scorm_course"]["points_possible"]).to eq(scorm_course.points_possible)
  end

  it "Updates the status" do
    expect do
      subject.perform_now(export, @application_instance, ims_export_params.to_json)
    end.to change(export, :status).to(ImsExport::COMPLETED)
  end
end
