class ImsExportJob < ApplicationJob
  retry_on StandardError, attempts: 16

  def perform(
    export,
    application_instance,
    ims_export_params
  )
    params = JSON.parse(ims_export_params).with_indifferent_access

    lti_launches = LtiLaunch.where(context_id: params[:context_id])
    lti_launch_configs = lti_launches.pluck(:config)
    scorm_course_ids = lti_launch_configs.map { |llc| llc[:scorm_course_id] }
    scorm_courses = ScormCourse.where(id: scorm_course_ids)
    lti_launches_payloads = lti_launches.find_each.map do |lti_launch|
      scorm_course_id = lti_launch.config[:scorm_course_id]
      if scorm_course = scorm_courses.detect { |sc| sc.id == scorm_course_id }
        payload_json(scorm_course, lti_launch)
      end
    end

    payload = {
      export_token: export.token,
      application_instance_id: application_instance.id,
      context_id: params[:context_id],
      tool_consumer_instance_guid: params[:tool_consumer_instance_guid],
      lti_launches: lti_launches_payloads.compact,
    }

    export.update(
      payload: payload,
      status: ImsExport::COMPLETED,
    )
  end

  def payload_json(scorm_course, lti_launch)
    {
      config: lti_launch.config,
      token: lti_launch.token,
      context_id: lti_launch.context_id,
      tool_consumer_instance_guid: lti_launch.tool_consumer_instance_guid,
      scorm_course: {
        "$canvas_assignment_id": scorm_course.lms_assignment_id,
        "$canvas_attachment_id": scorm_course.file_id,
        points_possible: scorm_course.points_possible,
        title: scorm_course.title,
        grading_type: scorm_course.grading_type,
      },
    }
  end
end
