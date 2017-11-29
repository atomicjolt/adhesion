class AttendanceReportJob < ApplicationJob
  include AttendanceExportsHelper
  include Concerns::CanvasSupport
  queue_as :default

  def perform(
    tenant,
    application_instance_id,
    user_id,
    lms_course_id,
    start_date,
    end_date
  )
    Apartment::Tenant.switch(tenant) do
      application_instance = ApplicationInstance.find(application_instance_id)
      current_user = User.find(user_id)
      @canvas_api = canvas_api(
        application_instance: application_instance,
        user: current_user,
      )
      attendances = AttendanceExportsHelper.get_attendances(lms_course_id, start_date, end_date)
      final_csv = AttendanceExportsHelper.generate_csv(attendances)
      new_file = File.new("attendance-#{Date.today}.csv", "w")
      new_file.puts(final_csv)
      new_file.close
      upload_canvas_file(new_file, lms_course_id)
    end
  end

  def upload_canvas_file(file, lms_course_id)
    if file.present?
      canvas_response = @canvas_api.proxy(
        "COURSES_UPLOAD_FILE",
        {
          course_id: lms_course_id,
        },
        {
          name: file.to_path,
          content_type: "text/csv",
          parent_folder_path: "attendance/",
          on_duplicate: "rename",
        },
      ).parsed_response
      canvas_response["upload_params"]["file"] = File.new(file)
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
