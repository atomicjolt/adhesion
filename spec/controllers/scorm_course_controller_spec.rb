require "rails_helper"

RSpec.describe ScormCourseController, type: :controller do
  describe "POST#postback" do
    it "should reject bad password" do
      reg = Registration.create
      post :postback, {
        data:
          "<registrationreport format='summary' regid='#{reg.id}' instanceid='0'><complete>complete</complete><success>failed</success><totaltime>19</totaltime><score>0</score></registrationreport>",
        password: 'FakePass'
      }
      expect(response.status).to equal(400)
    end

    it "should accept good password" do
      reg = Registration.create
      post :postback, {
        data:
          "<registrationreport format='summary' regid='#{reg.id}' instanceid='0'><complete>complete</complete><success>failed</success><totaltime>19</totaltime><score>0</score></registrationreport>",
        password: reg.scorm_cloud_passback_secret
      }
      expect(response.status).to equal(200)
    end
  end
end
