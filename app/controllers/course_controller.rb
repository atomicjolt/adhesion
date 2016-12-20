class CourseController < ApplicationController
  def registration_params
    params.permit(:course_id, :user_id)
  end

  def index
    @courses = scorm_cloud.course.get_course_list
  end

  def launch
    course_index_url
    @user_id = 9
    registration = Registration.where(
      lms_course_id: registration_params[:course_id],
      lms_user_id: @user_id,
    ).first
    if registration.nil?
      registration = Registration.create
      scorm_cloud.registration.create_registration(
        registration_params[:course_id],
        registration.id,
        "Seth",
        "Bertlshofer",
        1,
      )
    end
    redirect_to scorm_cloud.registration.launch(
      registration.id,
      "localhost:3000",
    )
  end
end
