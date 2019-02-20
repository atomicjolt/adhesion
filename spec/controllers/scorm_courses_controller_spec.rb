require "rails_helper"
require "ajims/lti"

RSpec.describe ScormCoursesController, type: :controller do
  describe "POST#postback" do
    before(:example) do
      @application_instance = FactoryBot.create(:application_instance)
      @application_instance.application.
        update_attributes(default_config: { scorm_type: "cloud" })
      allow(controller).to receive(
        :current_application_instance,
      ).and_return(@application_instance)
      scorm_course = create(:scorm_course)
      @reg = create(
        :registration,
        application_instance: @application_instance,
        scorm_course: scorm_course,
        context_id: FactoryBot.generate(:context_id),
      )
      response = Object.new
      allow(response).to receive(:success?).and_return(true)
      allow_any_instance_of(AJIMS::LTI::ToolProvider).to receive(:post_replace_result!).and_return(response)
      @student = FactoryBot.create(:user_canvas, lms_user_id: FactoryBot.generate(:lms_user_id))
    end
    it "should reject bad password" do
      params = {
        data:
          "<registrationreport
            format='summary'
            regid='#{@reg.scorm_registration_id}'
            instanceid='0'>
              <complete>complete</complete>
              <success>failed</success>
              <totaltime>19</totaltime>
              <score>0</score>
          </registrationreport>",
        password: "FakePass",
      }
      post :postback, params: params
      expect(response.status).to equal(400)
    end

    it "should accept good password" do
      params = {
        data:
          "<registrationreport
            format='summary'
            regid='#{@reg.scorm_registration_id}'
            instanceid='0'>
              <complete>complete</complete>
              <success>failed</success>
              <totaltime>19</totaltime>
              <score>0</score>
              <learner>
                <id>#{@student.lms_user_id}</id>
              </learner>
          </registrationreport>",
        password: @reg.scorm_cloud_passback_secret,
      }
      post :postback, params: params
      expect(response.status).to equal(200)
    end
  end

  describe "Create ScormCloudService" do
    before(:example) do
      allow_any_instance_of(ScormCloud::ScormCloud).to receive(
        :registration,
      ).and_return(MockScorm.new)
      @application_instance = FactoryBot.create(:application_instance)
      @application_instance.application.
        update_attributes(default_config: { scorm_type: "cloud" })
      allow(controller).to receive(
        :current_application_instance,
      ).and_return(@application_instance)
      Registration.create(lms_user_id: 2)
      scu = scorm_courses_url
      @params = lti_params(@application_instance.lti_key,
                           @application_instance.lti_secret,
                           "custom_canvas_user_id" => 2,
                           "course_id" => 1,
                           "launch_url" => scorm_courses_url,
                           "roles" => "Learner",
                           "launch_presentation_return_url" => scu)
    end
    it "should handle the successful launch of a new SCORM course" do
      request.env["CONTENT_TYPE"] = "application/x-www-form-urlencoded"
      post :create, params: @params
      expect(response.status).to eq(302)
    end
    it "should handle the failed launch of a new SCORM course" do
      obj = ScormEngineService.new("1")
      allow(controller).to receive(:scorm_connect_service).and_return(obj)
      meh = Object.new
      allow(obj).to receive(:get_registration).and_return(meh)
      launch_course = { status: 401 }
      allow(obj).to receive(:launch_course).and_return(launch_course)

      post :create, params: @params
      expect(response.status).to eq(401)
    end
  end

  # describe "Create ScormEngineService" do
  #   before(:example) do
  #     @application_instance = FactoryBot.create(:application_instance)
  #     @application_instance.application.
  #       update_attributes(default_config: { scorm_type: "engine" })
  #     allow(controller).to receive(
  #       :current_application_instance,
  #     ).and_return(@application_instance)
  #     registration = Registration.create(lms_user_id: 2)
  #     scu = scorm_courses_url
  #     @params = lti_params(@application_instance.lti_key,
  #                          @application_instance.lti_secret,
  #                          "custom_canvas_user_id" => 2,
  #                          "course_id" => 1,
  #                          "launch_url" => scorm_courses_url,
  #                          "roles" => "Learner",
  #                          "launch_presentation_return_url" => scu)
  #     api_interface = Rails.application.secrets.scorm_api_path
  #     scorm_tenant_url = Rails.application.secrets.scorm_url + api_interface + "default"

  #     registration_url = scorm_tenant_url + "/registrations"
  #     stub_request(:any, registration_url).to_return(body: "{ \"response\": \"nil\" }")
  #     launch_url = scorm_tenant_url + "/registrations/#{registration.scorm_registration_id + 1}/launchLink"
  #     stub_request(:any, launch_url).to_return(body: "{ \"launchLink\": \"https://www.example.com/launchLink\" }")
  #   end
  #   it "should handle the successful launch of a new SCORM course" do
  #     request.env["CONTENT_TYPE"] = "application/x-www-form-urlencoded"
  #     post :create, @params
  #     expect(assigns(:scorm_connect)).to_not eq(nil)
  #     expect(response.status).to eq(302)
  #   end
  #   it "should handle the failed launch of a new SCORM course" do
  #     post :create, @params
  #     expect(response.status).to eq(401)
  #   end
  # end
end

class MockScorm
  @status = 200
  def launch(registration_id, redirect_url)
    response = "status: 200,
      body: '<rsp>
               <registrationreport
                 format='summary'
                 regid='#{registration_id}'
                 instanceid='0'>
                 <complete>complete</complete>
                 <success>failed</success>
                 <totaltime>19</totaltime>
                 <score>0</score>
               </registrationreport>
             </rsp>',
      headers: {},
      #{redirect_url}"
    response
  end

  def get_registration_result(registration_id)
    response = "{
      status: 200,
      body: '<rsp>
               <registrationreport
                 format='summary'
                 regid='#{registration_id}'
                 instanceid='0'>
                 <complete>complete</complete>
                 <success>failed</success>
                 <totaltime>19</totaltime>
                 <score>0</score>
               </registrationreport>
             </rsp>',
      headers: {},
    }"
    response
  end

  def create_registration(one, two, three, four, five, six); end
end
