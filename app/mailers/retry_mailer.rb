class RetryMailer < ApplicationMailer
  def retry_email(job_name, retry_info)
    @job_name = job_name
    @retry_info = JSON.parse(retry_info).with_indifferent_access

    mail(
      from: Rails.application.secrets.error_email,
      to: Rails.application.secrets.error_email,
      subject: "#{@job_name} failed and needs to be retried.",
    )
  end
end
