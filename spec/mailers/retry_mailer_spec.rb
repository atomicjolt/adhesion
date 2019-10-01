require "rails_helper"

RSpec.describe RetryMailer, type: :mailer do
  describe "retry_email" do
    let(:mail) do
      user = User.new(
        email: "meh@example.com",
        name: "bfcoder",
        lti_user_id: "123abc",
        lms_user_id: "456def",
      )

      retry_with = "UploadCanvasJob.perform_later(ApplicationInstance.find_by(id: 9), User.find_by(id: ''), '134', ScormCourse.find_by(id: 36), '/tmp/job/36/SequencingSimpleRemediation_SCORM20043rdEdition.zip', false)"

      retry_info = {
        user_id: "1",
        user_email: user.email,
        user_name: user.name,
        lti_user_id: user.lti_user_id,
        lms_user_id: user.lms_user_id,
        timestamp: Time.zone.now,
        retry_with: retry_with,
      }
      RetryMailer.retry_email("UploadCanvasJob", retry_info.to_json)
    end

    it "renders the headers" do
      expect(mail.subject).to eq("UploadCanvasJob failed and needs to be retried.")
      # We wanted sendmail to assign the from value,
      # however rails won't let us leave the from value blank
      expect(mail.from).to eq([])
    end

    it "renders the body" do
      expect(mail.body.encoded).to match("user_id: 1")
      expect(mail.body.encoded).to match("user_email: meh@example.com")
      expect(mail.body.encoded).to match("user_name: bfcoder")
      expect(mail.body.encoded).to match("lti_user_id: 123abc")
      expect(mail.body.encoded).to match("lms_user_id: 456def")
      expect(mail.body.encoded).to match(/UploadCanvasJob.perform_later\(ApplicationInstance.find_by\(id: 9\), User.find_by\(id: ''\), '134', ScormCourse.find_by\(id: 36\), '\/tmp\/job\/36\/SequencingSimpleRemediation_SCORM20043rdEdition.zip', false\)/)
    end
  end
end
