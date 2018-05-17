require "rails_helper"

RSpec.describe ErrorMailer, type: :mailer do
  describe "error_email" do
    let(:mail) do
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
      ErrorMailer.error_email(user, error_info.to_json)
    end

    it "renders the headers" do
      expect(mail.subject).to eq("you did : something wrong")
      expect(mail.from).to eq(nil) # We want sendmail to assign the from value
    end

    it "renders the body" do
      expect(mail.body.encoded).to match("User bfcoder had an error")
      expect(mail.body.encoded).to match("user_id: 1")
      expect(mail.body.encoded).to match("user_email: meh@example.com")
      expect(mail.body.encoded).to match("user_name: bfcoder")
      expect(mail.body.encoded).to match("lti_user_id: 123abc")
      expect(mail.body.encoded).to match("lms_user_id: 456def")
      expect(mail.body.encoded).to match("error: 500")
      expect(mail.body.encoded).to match("exception: you did : something wrong")
      expect(mail.body.encoded).to match("custom_controller.rb")
      expect(mail.body.encoded).to match("application_controller.rb")
    end
  end
end
