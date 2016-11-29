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

  describe "Create" do
    it "should handle the setup method and the scorm_cloud instance variable before the creation of the SCORM course" do
      lti_application_instance = LtiApplicationInstance.create({ 
        lti_key: 'scorm-player',
        lti_secret: '1a84464b524ea1a5363b76a1306209d58ca37d3b21111703909a9150c03101294c8bf9c3e57d528c416fb7c8f188180ea27e21511e86a1fff296617d146b3963',
        lti_consumer_uri: 'https://canvas.instructure.com',
        canvas_token: 1234
        })
      params = {
        oauth_consumer_key: 'scorm-player'
      }
      post :create, params, {current_lti_application_instance: lti_application_instance}
      expect(assigns(:scorm_cloud)).to_not eq(nil)
    end

    it "should handle the successful launch of a new SCORM course" do
      lti_application_instance = LtiApplicationInstance.create({ 
        lti_key: 'scorm-player',
        lti_secret: '1a84464b524ea1a5363b76a1306209d58ca37d3b21111703909a9150c03101294c8bf9c3e57d528c416fb7c8f188180ea27e21511e86a1fff296617d146b3963',
        lti_consumer_uri: 'https://canvas.instructure.com',
        canvas_token: 1234
        })
      params = {
        oauth_consumer_key: 'scorm-player'
      }
      @scorm_cloud = ScormCloudService.new
      launch = @scorm_cloud.launch_course(
        scorm_course_id: 1,
        lms_user_id: 1,
        first_name: 'Steve',
        last_name: 'Someone',
        redirect_url: 'IMASPEC',
        postback_url: 'ALSOASPEC',
        lti_credentials: lti_application_instance,
        result_params: {
          id: 1,
          course_id: 1,
          custom_canvas_user_id: 1,
          lis_result_sourcedid: 'something'
        }
      )
      post :create, params, {current_lti_application_instance: lti_application_instance}, launch
      expect(response.status).to eq(200)
    end

    it "should handle the failed creation of a new SCORM course" do
      lti_application_instance = LtiApplicationInstance.create({ 
        lti_key: 'scorm-player',
        lti_secret: '1a84464b524ea1a5363b76a1306209d58ca37d3b21111703909a9150c03101294c8bf9c3e57d528c416fb7c8f188180ea27e21511e86a1fff296617d146b3963',
        lti_consumer_uri: 'https://canvas.instructure.com',
        canvas_token: 1234
        })
      params = {
        oauth_consumer_key: 'scorm-player'
      }
      post :create, params, {current_lti_application_instance: lti_application_instance}
      expect(response.status).to eq(401)
    end
  end
end
