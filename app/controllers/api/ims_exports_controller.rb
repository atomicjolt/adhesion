class Api::ImsExportsController < ApplicationController

  include Concerns::CanvasImsccSupport

  def show
    export = ImsExport.find_by(token: params[:id])
    respond_to do |format|
      format.json { render json: export.payload.merge(ims_export_id: export.token) }
    end
  end

  def status
    respond_to do |format|
      format.json { render json: { status: "completed" } }
    end
  end

  def create
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
      application_instance_id: current_application_instance.id,
      context_id: params[:context_id],
      lti_launches: lti_launches_payloads.compact,
    }
    export = ImsExport.create!(
      tool_consumer_instance_guid: params[:tool_consumer_instance_guid],
      context_id: params[:context_id],
      custom_canvas_course_id: params[:custom_canvas_course_id],
      payload: payload,
    )
    response = {
      "status_url": status_api_ims_export_url(export.token),
      "fetch_url": api_ims_export_url(export.token),
    }
    respond_to do |format|
      format.json { render json: response }
    end
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
      },
    }
  end

end
