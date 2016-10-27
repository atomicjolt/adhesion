class ScormCourseController < ApplicationController
  protect_from_forgery with: :null_session


  #TODO figure out authentication

  # NOTE:
  # Pass course params when registered
  # Get username from current_user
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
    redirect_to url
  end
end
