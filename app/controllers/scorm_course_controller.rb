class ScormCourseController < ApplicationController
  protect_from_forgery with: :null_session

  #TODO figure out authentication
  def create
		# registration = Registration.where(registration_params).first
		# if registration.nil?
		registration = Registration.create #registration_params
		scorm_cloud.registration.create_registration(
              1,
              registration.id,
              "",
              "",
              1# registration_params[:lms_user_id]
          )
		# end
    url = scorm_cloud.registration.launch(registration.id, lti_launches_url)
    # TODO post grade back to another method in this controller
    redirect_to url
  end
end
