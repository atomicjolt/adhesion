class AttendanceReportJob < ApplicationJob
  include AttendanceExportsHelper
  include CanvasSupport
  queue_as :default

  def perform(
    application_instance_id,
    user_id,
    lms_course_id,
    start_date,
    end_date
  )
    application_instance = ApplicationInstance.find(application_instance_id)
    current_user = User.find(user_id)
    current_course = Course.find_by(lms_course_id: lms_course_id)
    @canvas_api = canvas_api(
      application_instance: application_instance,
      user: current_user,
      canvas_course: current_course,
    )
    attendances = AttendanceExportsHelper.get_attendances(lms_course_id, start_date, end_date)
    final_csv = AttendanceExportsHelper.generate_csv(attendances)
    new_file = write_file(final_csv)
    upload_canvas_file(new_file, lms_course_id)
    FileUtils.remove_entry_secure(new_file)
  end

  def write_file(data)
    file_path = File.join(Dir.mktmpdir, "attendance-#{Date.today}.csv")
    file = File.open(file_path, "wb")
    file.puts(data)
    file.close
    file
  end

  def upload_canvas_file(file, lms_course_id)
    if file.present?
      canvas_response = @canvas_api.proxy(
        "COURSES_UPLOAD_FILE",
        {
          course_id: lms_course_id,
        },
        {
          name: File.basename(file),
          content_type: "text/csv",
          parent_folder_path: "attendance/",
          on_duplicate: "rename",
        },
      ).parsed_response
      canvas_response["upload_params"]["file"] = File.open(file)
      RestClient.post(
        canvas_response["upload_url"],
        canvas_response["upload_params"],
      ) do |response|
        case response.code
        when 200
          JSON.parse(response.body)["id"]
        when 302, 303
          file_confirm = RestClient.get(response.headers[:location])
          JSON.parse(file_confirm.body)["id"]
        end
      end
    end
  end
end
