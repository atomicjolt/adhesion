class ScormCourseController < ApplicationController
  protect_from_forgery with: :null_session
  before_action :setup


  #TODO figure out authentication

  def create
		launch = @scorm_cloud.launch_course(
      scorm_course_id: params[:course_id],
			lms_user_id: params[:custom_canvas_user_id],
			first_name: params[:lis_person_name_given],
      last_name: params[:lis_person_name_family],
			redirect_url: scorm_course_index_url
		)

    if launch[:status] == 200
      redirect_to launch[:response]
    else
      format.html { render file: "public/401.html", status: :unauthorized }
    end
  end

  def index
    render json: {message: "Finsished"}
  end

  private
    def setup
      @scorm_cloud = ScormCloudService.new
    end

end
