class ScormCourseController < ApplicationController
  protect_from_forgery with: :null_session
  before_action :setup


  #TODO figure out authentication

  def create
		launch = @scorm_cloud.launch_course(
      scorm_course_id: params[:course_id],
			lms_user_id: params[:custom_canvas_user_id], #TODO use canvas user id to create registrations
			first_name: params[:lis_person_name_given],  # TODO use given, and family name from params
      last_name: params[:lis_person_name_family],  # TODO use given, and family name from params
			redirect_url: lti_launches_url # TODO create finished with test endpoint
		)

    redirect_to launch[:response]
  end

  private
    def setup
      @scorm_cloud = ScormCloudService.new
    end

end
