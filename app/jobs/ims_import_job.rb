class ImsImportJob < ApplicationJob
  include CanvasSupport

  queue_as :ims_import

  retry_on StandardError, attempts: 16

  def perform(job_data, application_instance, user)
    data = JSON.parse(job_data).with_indifferent_access
    ims_import = ImsImport.find(data[:ims_import_id])
    ims_import.update(status: "started")

    @canvas_api = canvas_api(
      application_instance: application_instance,
      user: user,
      canvas_course: nil,
    )

    lti_launches = data[:lti_launches]
    context_id = data[:context_id]
    tool_consumer_instance_guid = data[:tool_consumer_instance_guid]
    lti_launches&.each do |lti_launch_attrs|
      scorm_course_attrs = lti_launch_attrs.delete(:scorm_course)

      # Not all LTI Launches have an associated scorm course
      lms_assignment_id = scorm_course_attrs.delete("$canvas_assignment_id")
      if lms_assignment_id != "$OBJECT_NOT_FOUND"
        scorm_course_attrs[:lms_assignment_id] = lms_assignment_id
      end

      # Not all LTI Launches have an associated scorm package (ie deleted)
      file_id = scorm_course_attrs.delete("$canvas_attachment_id")
      file_id = nil if file_id == "$OBJECT_NOT_FOUND"

      scorm_course_attrs[:lms_course_id] = data[:canvas_course_id]
      scorm_course_attrs[:file_id] = file_id

      # Check to see if we already have an LTI Launch. If we do the user is likely importing the same content again.
      lti_launch = LtiLaunch.find_by(token: lti_launch_attrs[:token], context_id: context_id)

      if lti_launch.blank?
        lti_launch = create_lti_launch(
          scorm_course_attrs,
          lti_launch_attrs,
          context_id,
          tool_consumer_instance_guid,
        )
        new_scorm_course = true
      end

      scorm_course = lti_launch.scorm_course
      old_file_id = scorm_course.file_id
      scorm_course.update(scorm_course_attrs)

      if file_id.present? && (file_id.to_i != old_file_id || new_scorm_course)
        scorm_course.update(import_job_status: ScormCourse::CREATED)
        public_file_url = file_url(file_id)
        process_scorm_import_url(
          scorm_course,
          scorm_course_attrs[:lms_course_id],
          public_file_url,
          application_instance,
          user,
        )
      end
    end

    ims_import.update(status: "finished")
  rescue StandardError => e
    ims_import&.update(
      status: "failed",
      error_message: e.message,
      error_trace: e.backtrace,
    )
    raise e
  end

  def create_lti_launch(
    scorm_course_attrs,
    lti_launch_attrs,
    context_id,
    tool_consumer_instance_guid
  )
    scorm_course = ScormCourse.new(scorm_course_attrs)
    scorm_course.update(import_job_status: ScormCourse::CREATED)

    launch_attrs = merge_lti_launch_attrs(
      lti_launch_attrs,
      context_id,
      tool_consumer_instance_guid,
      scorm_course,
    )

    lti_launch = LtiLaunch.new(launch_attrs)
    lti_launch.context_id = context_id
    lti_launch.tool_consumer_instance_guid = tool_consumer_instance_guid
    lti_launch.save!
    lti_launch
  end

  def merge_lti_launch_attrs(attrs, context_id, tool_consumer_instance_guid, scorm_course)
    new_attrs = attrs.dup
    new_attrs[:context_id] = context_id
    new_attrs[:tool_consumer_instance_guid] = tool_consumer_instance_guid
    new_attrs[:scorm_course_id] = scorm_course.id
    new_attrs[:config] = {
      lms_course_id: scorm_course.lms_course_id,
      scorm_course_id: scorm_course.id,
      scorm_service_id: scorm_course.scorm_service_id,
    }
    new_attrs
  end

  def process_scorm_import_url(
    scorm_course,
    lms_course_id,
    public_file_url,
    application_instance,
    user
  )
    ScormImportJob.
      perform_later(
        application_instance,
        user,
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
end
