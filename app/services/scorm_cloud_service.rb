require "scorm_cloud"
include ScormCommonService

class ScormCloudService

  def initialize
    @scorm_cloud = ScormCloud::ScormCloud.new(
      Rails.application.secrets.scorm_cloud_app_id,
      Rails.application.secrets.scorm_cloud_secret_key,
    )
  end

  def sync_courses(courses)
    if courses
      course_ids = courses.map(&:id)
      existing_course_ids = ScormCourse.all.map { |c| c[:scorm_cloud_id] }
      extra = existing_course_ids - course_ids
      needed = course_ids - existing_course_ids

      extra.each do |scorm_cloud_id|
        ScormCourse.find_by(scorm_cloud_id: scorm_cloud_id).destroy
        registrations = Registration.where(lms_course_id: scorm_cloud_id.to_i)
        registrations.each do |reg|
          @scorm_cloud.registration.delete_registration(reg.id)
          reg.destroy
        end
      end

      new_courses = []
      needed.each { |scorm_cloud_id| new_courses << ScormCourse.create(scorm_cloud_id: scorm_cloud_id) }
      new_courses.each do |course|
        title = courses.detect { |c| c.id == course.scorm_cloud_id }.title
        course.update_attribute(:title, title)
      end

      results = courses.select do |course|
        local_course = ScormCourse.find_by(scorm_cloud_id: course.id)
        return false if local_course.nil?
        true
      end

      result = results.map do |course|
        local_course = ScormCourse.find_by(scorm_cloud_id: course.id)
        resp = {
          title: course.title,
          id: local_course.scorm_cloud_id,
        }

        if local_course.lms_assignment_id.nil? == false
          resp[:lms_assignment_id] = local_course.lms_assignment_id
          resp[:is_graded] = if !local_course.points_possible.nil? && local_course.points_possible > 0
                               SCORM_ASSIGNMENT_STATE[:GRADED]
                             else
                               SCORM_ASSIGNMENT_STATE[:UNGRADED]
                             end
        end
        resp
      end

      result
    end
  end

  ### Scorm Cloud api wrapper methods
  def launch_course(registration, redirect_url)
    scorm_cloud_request do
      @scorm_cloud.registration.launch(registration.id, redirect_url)
    end
  end

  def setup_engine_registration(registration, user, postback_url, lti_credentials, course_id)
    scorm_cloud_request do
      @scorm_cloud.registration.create_registration(
        course_id,
        registration.id,
        user[:first_name],
        user[:last_name],
        user[:lms_user_id],
        postbackurl: postback_url,
        authtype: "form",
        urlpass: registration.scorm_cloud_passback_secret,
        urlname: lti_credentials.lti_key,
      )
    end
  end

  def list_courses(options = {})
    scorm_cloud_request do
      @scorm_cloud.course.get_course_list(options)
    end
  end

  def upload_engine_course(file, course_id, cleanup)
    scorm_cloud_request(cleanup) do
      @scorm_cloud.course.import_course(
        course_id,
        file,
      )
    end
  end

  def show_course(course_id)
    scorm_cloud_request do
      @scorm_cloud.course.get_attributes(course_id)
    end
  end

  def remove_engine_course(course_id)
    scorm_cloud_request do
      @scorm_cloud.course.delete_course(course_id)
    end
  end

  def remove_engine_registration(registration_id)
    scorm_cloud_request do
      @scorm_cloud.registration.delete_registration(registration_id)
    end
  end

  def preview_course(course_id, redirect_url)
    scorm_cloud_request do
      @scorm_cloud.course.preview(course_id, redirect_url)
    end
  end

  def course_metadata(course_id)
    scorm_cloud_request do
      @scorm_cloud.course.get_metadata(course_id)
    end
  end

  def course_manifest(course_id)
    scorm_cloud_request do
      resp = @scorm_cloud.course.get_manifest(course_id)
      Hash.from_xml(resp)
    end
  end

  def registration_engine_result(registration_id)
    scorm_cloud_request do
      resp = @scorm_cloud.registration.get_registration_result(registration_id)
      Hash.from_xml(resp)
    end
  end

  def scorm_cloud_request(handle_fail = nil)
    begin
      return {
        status: 200,
        response: yield,
      }

    rescue ScormCloud::InvalidPackageError => e
      response = { error: e.to_s, status: 400 }
    rescue ScormCloud::RequestError => e
      response = { error: e.to_s, status: 400 }
    rescue ScormCloud::Error => e
      response = { error: e.to_s, status: 400 }
    end
    handle_fail.call if handle_fail.respond_to? :call
    response
  end
end

class ScormConnectError < StandardError
end
