require "rails_helper"

RSpec.describe PostGradesJob, type: :job do
  include ActiveJob::TestHelper

  after do
    clear_enqueued_jobs
  end

  subject { PostGradesJob }

  let(:application_instance) { create(:application_instance) }

  let(:user) { create(:user) }

  let(:data) do
    {
      sections: sections,
      gradetype: gradetype,
      assignment_id: assignment_id,
    }
  end

  let(:sections) do
    [
      { id: -1 },
      { id: 1028, sis_section_id: nil, sis_course_id: "bfcoder-small101" },
    ]
  end

  let(:gradetype) { "final" }

  let(:assignment_id) { "32699" }

  let(:canvas_api) { Object.new }

  let(:fake_enrollments) do
    JSON.parse(File.read("spec/fixtures/json/fake_enrollments_large.json"))
  end

  let(:fake_assignment_submissions) do
    JSON.parse(File.read("spec/fixtures/json/fake_assignment_submissions_sections.json"))
  end

  context "Sis Grades" do
    before do
      allow(canvas_api).to receive(:proxy).
        with("LIST_ASSIGNMENT_SUBMISSIONS_SECTIONS", { section_id: 1028, assignment_id: "32699" }, nil, true).
        and_return(fake_assignment_submissions)
      allow(canvas_api).to receive(:proxy).
        with("LIST_ENROLLMENTS_SECTIONS", { section_id: 1028 }, nil, true).
        and_return(fake_enrollments)
      allow_any_instance_of(subject).to receive(:canvas_api).and_return(canvas_api)
    end

    it "are created" do
      expect do
        subject.perform_now(data.to_json, application_instance, user)
      end.to change(SisGrade, :count).by(1)
    end

    it "stores grades" do
      subject.perform_now(data.to_json, application_instance, user)
      sis_grade = SisGrade.find_by(sis_course_id: "bfcoder-small101")

      expect(sis_grade.grades.count).to eq(14)
      expect(sis_grade.grades).to include({ "grade" => "F", "score" => 60.0, "sis_user_id" => "DEMO_STUDENT_SIS_ID" })
      expect(sis_grade.grades).to include({ "grade" => "B+", "score" => 87.0, "sis_user_id" => "42FTW" })
      expect(sis_grade.grades).to include({ "grade" => "A-", "score" => 90.0, "sis_user_id" => nil })
      expect(sis_grade.grades).to include({ "grade" => "B", "score" => 85.0, "sis_user_id" => nil })
      expect(sis_grade.grades).to include({ "grade" => "B", "score" => 86.0, "sis_user_id" => nil })
      expect(sis_grade.grades).to include({ "grade" => "A-", "score" => 93.0, "sis_user_id" => nil })
      expect(sis_grade.grades).to include({ "grade" => "A", "score" => 110.0, "sis_user_id" => nil })
      expect(sis_grade.grades).to include({ "grade" => "F", "score" => 20.0, "sis_user_id" => nil })
      expect(sis_grade.grades).to include({ "grade" => "C", "score" => 76.0, "sis_user_id" => nil })
      expect(sis_grade.grades).to include({ "grade" => "A", "score" => 99.0, "sis_user_id" => nil })
      expect(sis_grade.grades).to include({ "grade" => "F", "score" => 51.0, "sis_user_id" => nil })
      expect(sis_grade.grades).to include({ "grade" => "D", "score" => 64.0, "sis_user_id" => nil })
      expect(sis_grade.grades).to include({ "grade" => "A-", "score" => 93.0, "sis_user_id" => nil })
      expect(sis_grade.grades).to include({ "grade" => "A", "score" => 100.0, "sis_user_id" => nil })
    end
  end
end
