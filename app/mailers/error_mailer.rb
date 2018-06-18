class ErrorMailer < ApplicationMailer
  def error_email(user, error_info)
    @user = user
    @error_info = JSON.parse(error_info).with_indifferent_access

    mail(
      to: Rails.application.secrets.error_email,
      subject: @error_info[:exception],
    )
  end
end
