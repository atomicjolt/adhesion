require "rails_helper"

RSpec.describe ScormCoursesController, type: :controller do
  describe "POST#postback" do
    it "should reject bad password" do
      reg = Registration.create
      post(
        :postback,
        data:
          "<registrationreport
            format='summary'
            regid='#{reg.id}'
            instanceid='0'>
              <complete>complete</complete>
              <success>failed</success>
              <totaltime>19</totaltime>
              <score>0</score>
          </registrationreport>",
        password: "FakePass",
      )
      expect(response.status).to equal(400)
    end

    it "should accept good password" do
      reg = Registration.create
      post(
        :postback,
        data:
          "<registrationreport
            format='summary'
            regid='#{reg.id}'
            instanceid='0'>
              <complete>complete</complete>
              <success>failed</success>
              <totaltime>19</totaltime>
              <score>0</score>
          </registrationreport>",
        password: reg.scorm_cloud_passback_secret,
      )
      expect(response.status).to equal(200)
    end
  end

  describe "Create" do
    before do
      @lti_application_instance = FactoryGirl.create(:lti_application_instance)
      allow(controller).to receive(
        :current_lti_application_instance,
      ).and_return(@lti_application_instance)
      reg = Registration.create(lms_user_id: 2)
      stub_request(:get, /cloud.scorm.com/).
        to_return(status: 200,
                  body: "<rsp>
                         <registrationreport
                           format='summary'
                           regid='#{reg.id}'
                           instanceid='0'>
                           <complete>complete</complete>
                           <success>failed</success>
                           <totaltime>19</totaltime>
                           <score>0</score>
                         </registrationreport>
                       </rsp>",
                  headers: {})
      @params = lti_params(@lti_application_instance.lti_key,
                           @lti_application_instance.lti_secret,
                           "custom_canvas_user_id" => 2,
                           "course_id" => 1,
                           "launch_url" => scorm_courses_url,
                           "roles" => "Learner")
    end
    it "should handle the setup method" do
      request.env["CONTENT_TYPE"] = "application/x-www-form-urlencoded"
      post :create, @params
      expect(assigns(:scorm_cloud)).to_not eq(nil)
    end

    it "should handle the successful launch of a new SCORM course" do
      request.env["CONTENT_TYPE"] = "application/x-www-form-urlencoded"
      post :create, @params
      expect(response.status).to eq(302)
    end

    it "should handle the failed creation of a new SCORM course" do
      post :create, @params
      expect(response.status).to eq(401)
    end
  end
end
