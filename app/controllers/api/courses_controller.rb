class Api::CoursesController < ApplicationController
	protect_from_forgery with: :null_session
	# before_action :validate_token # TODO: make sure to add account back in for security

    def registration_params
        permitted = params.permit(:course_id, :user_id)
        return {
            lms_course_id: permitted[:course_id],
            lms_user_id: current_user.id
        }
    end

    def split_name
        parts = current_user.name.split(" ")
        [parts.shift, parts.join(' ')]
    end

	def index
		@courses = scorm_cloud.course.get_course_list
        render json: @courses
	end

	def create
        begin
            course = ScormCourse.create
            response = scorm_cloud.course.import_course(course.id, params[:filename])
        return render json: {response: response}

        rescue ScormCloud::InvalidPackageError => e
            render json: {error: e}, status: 400
        rescue ScormCloud::RequestError => e
            render json: {error: e}, status: 400
        rescue ScormCloud::Error => e
            render json: {error: e}, status: 500
        end
        course.destroy # If we failed we should remove course because it wasn't actually created
	end

	def launch
		registration = Registration.where(registration_params).first

		if registration.nil?
			registration = Registration.create registration_params
			scorm_cloud.registration.create_registration(
                registration_params[:lms_course_id],
                registration.id,
                split_name[0],
                split_name[1],
                registration_params[:lms_user_id]
            )
		end
        render json: {launch_url: scorm_cloud.registration.launch(registration.id, course_index_url)}
	end

	def show
		begin
			course_info = scorm_cloud.course.get_attributes(params[:id])
			render json: course_info

		rescue ScormCloud::InvalidPackageError => e
		    render json: {error: e}, status: 400
		rescue ScormCloud::RequestError => e
			render json: {error: e}, status: 400
		rescue ScormCloud::Error => e
			render json: {error: e}, status: 500
		end
	end

	def destroy
		begin
			response = scorm_cloud.course.delete_course(params[:id])
			course = ScormCourse.find(params[:id])
			course.destroy unless course.nil?
			render json:{response: response}

		rescue ScormCloud::InvalidPackageError => e
		  render json: {error: e}, status: 400
		rescue ScormCloud::RequestError => e
			render json: {error: e}, status: 400
		rescue ScormCloud::Error => e
			render json: {error: e}, status: 500
		end
	end

	def scorm_cloud_request
		begin
			return yield
		rescue ScormCloud::InvalidPackageError => e
		  render json: {error: e}, status: 400
		rescue ScormCloud::RequestError => e
			render json: {error: e}, status: 400
		rescue ScormCloud::Error => e
			render json: {error: e}, status: 500
		end
	end

	def preview
		scorm_cloud_request do
			preview_url = scorm_cloud.course.preview(params[:id], params[:redirect_url])
			render json: {launch_url: preview_url}
		end
	end

end
