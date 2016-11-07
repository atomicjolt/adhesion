require "scorm_cloud"

class ScormCloudService

  SCORM_ASSIGNMENT_STATE = {
    GRADED: "GRADED",
    UNGRADED: "UNGRADED"
  }

  def initialize
    @scorm_cloud = ScormCloud::ScormCloud.new(ENV["SCORM_CLOUD_APP_ID"], ENV["SCORM_CLOUD_SECRET_KEY"])
  end

  def split_name(name)
      parts = name.split(" ")
      [parts.shift, parts.join(' ')]
  end

  def reg_params(params)
    resp = {}
    resp[:id] = params[:id] unless params[:id].nil?
    resp[:lms_course_id] = params[:course_id] unless params[:course_id].nil?
    resp[:lms_user_id] =  params[:custom_canvas_user_id] unless params[:custom_canvas_user_id].nil?
    resp[:lis_result_sourcedid] = params[:lis_result_sourcedid] unless params[:lis_result_sourcedid].nil?
    resp[:lis_outcome_service_url] = params[:lis_outcome_service_url] unless params[:lis_outcome_service_url].nil?
    resp
  end


  def find_registration(lms_course_id,lms_user_id)
    registration_params = {
        lms_course_id: lms_course_id,
        lms_user_id: lms_user_id
      }
		Registration.where(registration_params).first
  end

  def package_score(reg_result)
    score = reg_result["score"]
    score.to_i / 100.0
  end

  def package_complete?(reg_result)
    result = reg_result["complete"]
    result == "complete"
  end

  def reg_id(reg_result)
    reg_result["regid"]
  end

  ### Sync Utilities
  ## Assist in keeping scorm cloud, canvas, and local tables in sync

  def sync_registration_score(reg_result)
    reg = Registration.find(reg_id(reg_result))
    dirty = false
    new_score = package_score(reg_result)

    if(reg.score != new_score)
      dirty = true
      reg.score = new_score
      reg.save!
    end

    if(package_complete?(reg_result) && dirty == true)
      tp_params = {
        'lis_outcome_service_url' =>  reg[:lis_outcome_service_url],
        'lis_result_sourcedid' => reg[:lis_result_sourcedid],
        'user_id' => reg[:lms_user_id]
      }
      provider = IMS::LTI::ToolProvider.new(
        reg.lti_application.lti_key,
        reg.lti_application.lti_secret,
        tp_params
      )
       response = provider.post_replace_result!(reg.score)
       if response.success?
          # grade write worked
       elsif response.processing?
       elsif response.unsupported?
       else
         #TODO figure out how to handle postback failure
         # failed
       end
    end
  end

  def sync_registration(registration_params)
    result = registration_result(
      registration_params[:course_id], registration_params[:custom_canvas_user_id]
    )
    return if result.nil?
    sync_registration_score(result[:response]["rsp"]["registrationreport"])
  end

  def sync_courses(courses)
    course_ids = courses.map{ |c| c[:id].to_i }
    existing_course_ids = ScormCourse.all.map{ |c| c[:id] }
    extra = existing_course_ids - course_ids
    needed = course_ids - existing_course_ids

    extra.each { |id| ScormCourse.destroy(id) }
    needed.each { |id| ScormCourse.create(scorm_cloud_id: id) }

    result = updated_courses = courses.select do |course|
      local_course = ScormCourse.where(scorm_cloud_id: course[:id]).first
      return false if local_course.nil?

      if(local_course.lms_assignment_id.nil? == false)
        course[:lms_assignment_id] = local_course.lms_assignment_id
        if !local_course.points_possible.nil? && local_course.points_possible > 0
          course[:is_graded] = SCORM_ASSIGNMENT_STATE[:GRADED]
        else
          course[:is_graded] = SCORM_ASSIGNMENT_STATE[:UNGRADED]
        end
      end
      true
    end

    result
  end

### Scorm Cloud api wrapper methods

  def launch_course(
    scorm_course_id:,
    lms_user_id:,
    first_name:,
    last_name:,
    redirect_url:,
    postback_url:,
    lti_credentials: {},
    result_params: {}
    )
    scorm_cloud_request do
      registration_params = {
        lms_course_id: scorm_course_id,
        lms_user_id: lms_user_id
      }
      registration = find_registration(scorm_course_id, lms_user_id)
      if registration.nil?
  			registration = Registration.create reg_params(result_params)
        registration.lti_application = lti_credentials
        registration.save!

  			response = @scorm_cloud.registration.create_registration(
          registration_params[:lms_course_id],
          registration.id,
          first_name,
          last_name,
          registration_params[:lms_user_id],
          {
            postbackurl: postback_url
          }
        )
  		end
      @scorm_cloud.registration.launch(registration.id, redirect_url)
    end
  end

  def list_courses
    scorm_cloud_request do
      @scorm_cloud.course.get_course_list
    end
  end

  def upload_course(file)
    course = ScormCourse.create
    cleanup = Proc.new { course.destroy }
    scorm_cloud_request(cleanup) do
      response = @scorm_cloud.course.import_course(course.id, file)
    end
  end

  def show_course(course_id)
    scorm_cloud_request do
	    @scorm_cloud.course.get_attributes(course_id)
    end
  end

  def remove_course(course_id)
    scorm_cloud_request do
      response = @scorm_cloud.course.delete_course(course_id)
      if response == true
    		course = ScormCourse.where(scorm_cloud_id: course_id).first
        course.destroy unless course.nil?
      end
      response
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
      @scorm_cloud.course.get_manifest(course_id)
    end
  end

  def registration_result(lms_course_id, lms_user_id)
    scorm_cloud_request do
      reg = find_registration(lms_course_id, lms_user_id)
        resp = @scorm_cloud.registration.get_registration_result(reg.id) unless reg.nil?
        Hash.from_xml(resp)
      end
  end

  def scorm_cloud_request(handle_fail = nil)
    begin
      return {
        status: 200,
        response: yield
      }
    rescue ScormCloud::InvalidPackageError => e
      response = {error: e.to_s, status: 400}
    rescue ScormCloud::RequestError => e
      response = {error: e.to_s, status:400}
    rescue ScormCloud::Error => e
      response = {error: e.to_s, status: 400}
    end
    handle_fail.call if handle_fail.respond_to? :call
    return response
  end
end
