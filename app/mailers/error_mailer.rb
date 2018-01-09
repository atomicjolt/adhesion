class ErrorMailer < ApplicationMailer
  def error_email(user, error_info)
    @user = user
    @error_info = error_info

    mail(
      to: Rails.application.secrets.error_email,
      subject: @error_info[:exception],
    )
  end
end
