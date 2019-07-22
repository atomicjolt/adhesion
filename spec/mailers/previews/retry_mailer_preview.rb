# Preview all emails at http://localhost:3000/rails/mailers/retry_mailer
class RetryMailerPreview < ActionMailer::Preview
  # Preview this email at http://localhost:3000/rails/mailers/retry_mailer/retry_email
  def retry_email
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
end
