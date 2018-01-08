# Preview all emails at http://localhost:3000/rails/mailers/error_mailer
class ErrorMailerPreview < ActionMailer::Preview
  # Preview this email at http://localhost:3000/rails/mailers/error_mailer/error_email
  def error_email
    backtrace = [
      "custom_controller.rb",
      "application_controller.rb",
    ]

    user = User.new(
      email: "meh@example.com",
      name: "bfcoder",
      lti_user_id: "123abc",
      lms_user_id: "456def",
    )

    error_info = {
      user_id: "1",
      user_email: user.email,
      user_name: user.name,
      lti_user_id: user.lti_user_id,
      lms_user_id: user.lms_user_id,
      timestamp: Time.zone.now,
      url: "example.com",
      request_method: "GET",
      params: {
        utf8: "✓",
        authenticity_token: "******",
        user: {
          email: "admin@example.com",
          password: "******",
          remember_me: "0",
        },
        commit: "Log in",
        controller: "sessions",
        action: "create",
      },
      headers: {
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6)",
        "Host": "bfcoderadmin.atomicjolt.xyz",
        "Version": "HTTP/1.1",
        "Referer": "https://bfcoderadmin.atomicjolt.xyz/users/sign_in",
        "If-None-Match": "meh",
      },
      error: 500,
      exception: "you did : something wrong",
      backtrace: backtrace,
    }
    ErrorMailer.error_email(user, error_info)
  end
end
