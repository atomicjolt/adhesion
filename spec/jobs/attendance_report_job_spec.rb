require "rails_helper"

RSpec.describe AttendanceReportJob, type: :job do
  subject { AttendanceReportJob }

  let(:application_instance_id) { create(:application_instance).id }
  let(:user_id) { create(:user).id }
  let(:lms_course_id) { create(:course).lms_course_id }
  let(:start_date) { Date.today.to_s }
  let(:end_date) { Date.today.to_s }

  it "fetches the content export" do
    expect_any_instance_of(subject).to receive(:upload_canvas_file).
      with(kind_of(File), lms_course_id)

    subject.perform_now(
      application_instance_id,
      user_id,
      lms_course_id,
      start_date,
      end_date,
    )
  end
end
