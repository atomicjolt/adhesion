require "rails_helper"

RSpec.describe ImsImportJob, type: :job do
  include ActiveJob::TestHelper

  after do
    clear_enqueued_jobs
  end

  subject { ImsImportJob }

  let(:ims_import) { FactoryBot.create(:ims_import) }

  let(:data) do
    {
      ims_import_id: ims_import.id,
      lti_launches: lti_launches,
      context_id: context_id,
      tool_consumer_instance_guid: tool_consumer_instance_guid,
      canvas_course_id: custom_canvas_course_id,
    }
  end

  let(:lti_launches) do
    [
      {
        token: "dgqgRSCUGdkmmKMAC3Ma2nei",
        config: {
          scorm_course_id: 41,
          scorm_service_id: "41_1234",
          lms_course_id: "1234",
        },
        scorm_course: {
          points_possible: 100.0,
          grading_type: generate(:grading_type),
          title: "meh 1",
        },
        context_id: context_id,
        tool_consumer_instance_guid: tool_consumer_instance_guid,
      },
      {
        token: "kcgmuAKNyRu55S1kT4XuY5ag",
        config: {
          scorm_course_id: 42,
          scorm_service_id: "42_1234",
          lms_course_id: "1234",
        },
        scorm_course: {
          "$canvas_assignment_id": "1221",
          "$canvas_attachment_id": "5665",
          points_possible: 100.0,
          grading_type: generate(:grading_type),
          title: "meh 2",
        },
        context_id: context_id,
        tool_consumer_instance_guid: tool_consumer_instance_guid,
      },
      {
        token: "jfvTHBDVW68y9auBLGihpq3G",
        config: {
          scorm_course_id: 43,
          scorm_service_id: "43_1234",
          lms_course_id: "1234",
        },
        scorm_course: {
          "$canvas_assignment_id": "1221",
          "$canvas_attachment_id": "$OBJECT_NOT_FOUND",
          points_possible: 100.0,
          grading_type: generate(:grading_type),
          title: "meh 3",
        },
        context_id: context_id,
        tool_consumer_instance_guid: tool_consumer_instance_guid,
      },
      {
        token: "N4aDqFbQzQFrPhqzyZuEJErd",
        config: {
          scorm_course_id: 44,
          scorm_service_id: "44_1234",
          lms_course_id: "1234",
        },
        scorm_course: {
          "$canvas_assignment_id": "1221",
          "$canvas_attachment_id": "7887",
          points_possible: 0.0,
          grading_type: generate(:grading_type),
          title: "meh 4",
        },
        context_id: context_id,
        tool_consumer_instance_guid: tool_consumer_instance_guid,
      },
    ]
  end

  let(:context_id) { "a07201ea2fa1314729ed8bf0175a336d1eebe053" }

  let(:tool_consumer_instance_guid) { "7MRcxnx6vQbFXxhLb8003m5WXFM2Z2i9lQwhJ1QT:canvas-lms" }

  let(:application_instance) { create(:application_instance) }

  let(:custom_canvas_course_id) { "1234" }

  let(:user) { create(:user) }

  context "lti launches" do
    it "are created" do
      expect do
        subject.perform_now(data.to_json, application_instance, user)
      end.to change(LtiLaunch, :count).by(4)
    end

    it "handles importing the same package multiple times" do
      expect do
        subject.perform_now(data.to_json, application_instance, user)
        subject.perform_now(data.to_json, application_instance, user)
      end.to change(LtiLaunch, :count).by(4)
    end

    context "scorm courses" do
      it "starts the import process" do
        subject.perform_now(data.to_json, application_instance, user)

        lti_launch = LtiLaunch.find_by(token: "dgqgRSCUGdkmmKMAC3Ma2nei")
        expect(lti_launch).to be
        expect(lti_launch.scorm_course_id).to_not eq(41)
        scorm_course = lti_launch.scorm_course
        expect(lti_launch.config).to eq(
          {
            lms_course_id: scorm_course.scorm_service_id.split("_").last,
            scorm_course_id: scorm_course.id,
            scorm_service_id: scorm_course.scorm_service_id,
          }.with_indifferent_access,
        )

        lti_launch2 = LtiLaunch.find_by(token: "kcgmuAKNyRu55S1kT4XuY5ag")
        expect(lti_launch2).to be
        scorm_course2 = lti_launch2.scorm_course
        expect(scorm_course2).to be
        expect(scorm_course2.file_id).to eq(5665)
      end

      context "scorm package" do
        it "enqueues scorm processing for 2 of the 4" do
          expect do
            subject.perform_now(data.to_json, application_instance, user)
          end.to change(enqueued_jobs, :size).by(2)
        end
      end
    end
  end

  context "import status" do
    it "finishes" do
      subject.perform_now(data.to_json)
      expect(ims_import.reload.status).to eq "finished"
    end
  end
end
