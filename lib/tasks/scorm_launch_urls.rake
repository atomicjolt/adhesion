desc "Fixes scorm launch urls"
task fix_scorm_launch_urls: [:environment] do
  Rake.application.invoke_task("fix_lti_launches_scorm_course_id")
  Rake.application.invoke_task("fix_scorm_course_lti_launch")
  Rake.application.invoke_task("update_scorm_launch_urls")
end

desc "Fix lti_launches scorm_course_id"
task fix_lti_launches_scorm_course_id: [:environment] do
  puts "Fixing lti_launches"

  scorm_app_instance = ApplicationInstance.find_by lti_key: Application::SCORM
  Apartment::Tenant.switch(scorm_app_instance.tenant) do
    LtiLaunch.where(scorm_course_id: nil).find_each do |ll|
      ll.update scorm_course_id: ll.config[:scorm_course_id]
    end
  end

  puts
  puts "     DONE!"
end

desc "Fix all ScormCourse to have an lti_launch"
task fix_scorm_course_lti_launch: [:environment] do
  puts "Fixing Scorm Courses to have an lti_launch"

  scorm_app_instance = ApplicationInstance.find_by lti_key: Application::SCORM
  Apartment::Tenant.switch(scorm_app_instance.tenant) do
    ScormCourse.find_each do |scorm_course|
      create_lti_launch(scorm_course) if scorm_course.lti_launch.nil?
    end
  end

  puts
  puts "     DONE!"
end

desc "Updates scorm launch urls"
task update_scorm_launch_urls: [:environment] do
  include CanvasSupport

  puts "Fixing scorm launch urls"

  scorm_app_instance = ApplicationInstance.find_by lti_key: Application::SCORM
  Apartment::Tenant.switch(scorm_app_instance.tenant) do
    @canvas_api = canvas_api(
      user: nil,
      canvas_course: nil,
      application_instance: scorm_app_instance,
    )

    i = 0
    scorm_courses = ScormCourse.where.not(lms_assignment_id: nil)
    n = scorm_courses.count

    scorm_courses.includes(:lti_launch).find_each do |scorm_course|
      i += 1
      puts "Attempting to fix scorm_course_id #{scorm_course.id} # #{i}/#{n}"

      create_lti_launch(scorm_course) if scorm_course.lti_launch.nil?

      lms_course_id = scorm_course.lti_launch.config[:lms_course_id]
      lms_assignment_id = scorm_course.lms_assignment_id
      if lms_course_id.present? && lms_assignment_id.present?
        begin
          assignment = get_assignment(lms_course_id, lms_assignment_id)
          original_lti_url = assignment["external_tool_tag_attributes"]["url"]
          if original_lti_url.exclude?("lti_launches")
            domain = scorm_app_instance.domain
            token = scorm_course.lti_launch.token
            lti_url = "https://#{domain}/lti_launches/#{token}"
            puts "Updating lms_course_id: #{lms_course_id} lms_assignment_id: #{lms_assignment_id}"
            puts "old_lti_url: #{original_lti_url} new_lti_url: #{lti_url}"
            edit_assignment(lms_course_id, lms_assignment_id, lti_url)
          end
        rescue LMS::Canvas::InvalidAPIRequestException => e
          puts e
        rescue LMS::Canvas::InvalidAPIRequestFailedException => e
          puts e
        end
      else
        puts "N/A"
      end
    end
  end

  puts
  puts "     DONE!"
end

def list_assignments(course_id)
  @canvas_api.proxy(
    "LIST_ASSIGNMENTS",
    { course_id: course_id },
  ).parsed_response
end

def get_assignment(lms_course_id, lms_assignment_id)
  @canvas_api.proxy(
    "GET_SINGLE_ASSIGNMENT",
    { course_id: lms_course_id, id: lms_assignment_id },
  ).parsed_response
end

def edit_assignment(lms_course_id, lms_assignment_id, lti_url)
  payload = {
    assignment: {
      external_tool_tag_attributes: {
        url: lti_url,
      },
    },
  }
  @canvas_api.proxy(
    "EDIT_ASSIGNMENT",
    { course_id: lms_course_id, id: lms_assignment_id },
    payload,
  )
end

def create_lti_launch(scorm_course)
  scorm_service_id = scorm_course.scorm_service_id
  lms_course_id = scorm_service_id&.split("_")&.last
  LtiLaunch.create(
    {
      scorm_course_id: scorm_course.id,
      config: {
        lms_course_id: lms_course_id,
        scorm_course_id: scorm_course.id,
        scorm_service_id: scorm_course.scorm_service_id,
      },
    },
  )
end
