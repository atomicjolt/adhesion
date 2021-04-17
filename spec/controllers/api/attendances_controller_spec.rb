require "rails_helper"

RSpec.describe Api::AttendancesController, type: :controller do
  before do
    setup_users
    request.headers["Authorization"] = @user_token
  end

  describe "POST #create" do
    before do
      students = []
      2.times do
        name = generate(:name)
        students << {
          name: name,
          sortable_name: name,
          lms_student_id: generate(:student_id),
        }
      end
      @params = {
        course_id: generate(:course_id),
        lms_course_id: generate(:course_id),
        date: Date.today,
        status: "PRESENT",
        students: students,
      }
    end

    it "successfully creates an attendance" do
      expect { post :create, params: @params }.to change { Attendance.count }.by(2)
    end

    it "returns index json" do
      post :create, params: @params
      expect(response.content_type).to eq("application/json")
    end

    it "successfully updates existing attendance record" do
      params_clone = @params.clone
      post :create, params: params_clone
      attendances = JSON.parse(response.body)
      expect(attendances.count).to eq(2)
      expect(attendances.first["status"]).to eq("PRESENT")
      expect(attendances.second["status"]).to eq("PRESENT")

      params_clone[:status] = "ABSENT"
      post :create, params: params_clone
      expect(response).to be_successful
      attendances = JSON.parse(response.body)
      expect(attendances.count).to eq(2)
      expect(attendances.first["status"]).to eq("ABSENT")
      expect(attendances.second["status"]).to eq("ABSENT")
    end

    it "successfully deletes existing attendance record" do
      params_clone = @params.clone
      post :create, params: params_clone

      params_clone[:status] = ""
      students = [
        {
          name: params_clone[:students].first[:name],
          sortable_name: params_clone[:students].first[:name],
          lms_student_id: params_clone[:students].first[:lms_student_id],
        },
      ]
      params_clone[:students] = students
      expect { post :create, params: params_clone }.to change { Attendance.count }.by(-1)
    end
  end

  describe "GET #search" do
    it "successfully returns the correct attendance record" do
      attendance1 = create(:attendance)
      create(:attendance, date: Date.today - 2.days)
      get :search, params: { course_id: attendance1[:lms_course_id], date: attendance1.date }
      result = JSON.parse(response.body)
      expect(result.count).to eq(1)
      expect(result.first["id"]).to eq(attendance1.id)
    end

    it "renders json" do
      attendance = create(:attendance)
      get :search, params: { course_id: attendance[:lms_course_id], date: attendance.date }
      expect(response.content_type).to eq("application/json")
    end
  end
end
