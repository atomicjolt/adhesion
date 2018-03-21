class Api::ImsImportsController < ApplicationController
  include Concerns::CanvasSupport
  include Concerns::CanvasImsccSupport

  def create
    @canvas_api = canvas_api(user: nil, course: nil)

    params[:data][:lti_launches].each do |current_params|
      scorm_course_attrs = scorm_course_params(current_params.delete(:scorm_course))

      # Not all LTI Launches have an associated scorm course
      lms_assignment_id = scorm_course_attrs.delete("$canvas_assignment_id")
      if lms_assignment_id != "$OBJECT_NOT_FOUND"
        scorm_course_attrs[:lms_assignment_id] = lms_assignment_id
      end

      # Not all LTI Launches have an associated scorm package (ie deleted)
      file_id = scorm_course_attrs.delete("$canvas_attachment_id")
      file_id = nil if file_id == "$OBJECT_NOT_FOUND"

      scorm_course_attrs[:lms_course_id] = params[:custom_canvas_course_id]

      lti_launch_attrs = lti_launch_params(current_params)

      # Check to see if we already have an LTI Launch. If we do the user is likely importing the same content again.
      lti_launch = LtiLaunch.find_by(token: lti_launch_attrs[:token], context_id: params[:context_id])

      if lti_launch.blank?
        lti_launch = LtiLaunch.new(lti_launch_attrs)
        lti_launch.context_id = params[:context_id]
        scorm_course = ScormCourse.new(scorm_course_attrs)
        scorm_course.update(import_job_status: ScormCourse::CREATED)
        lti_launch.config[:scorm_course_id] = scorm_course.id
        lti_launch.tool_consumer_instance_guid = params[:tool_consumer_instance_guid]
        lti_launch.save!

        if file_id.present?
          public_file_url = file_url(file_id)
          process_scorm_import_url(scorm_course, scorm_course_attrs[:lms_course_id], public_file_url)
        end
      end
    end

    render json: { status: "completed" }
  end

  private

  def process_scorm_import_url(scorm_course, lms_course_id, public_file_url)
    ScormImportJob.
      perform_later(
        current_application_instance,
        current_user,
        lms_course_id,
        scorm_course,
        nil,
        true,
        public_file_url,
      )
  end

  def file_url(file_id)
    @canvas_api.proxy("GET_PUBLIC_INLINE_PREVIEW_URL", { id: file_id }).parsed_response["public_url"]
  end

  def scorm_course_params(current_params)
    current_params.permit(
      "$canvas_assignment_id",
      "$canvas_attachment_id",
      :points_possible,
      :title,
    )
  end

  def lti_launch_params(current_params)
    current_params.permit(
      :token,
      config: current_params[:config].try(:keys),
    )
  end

end
