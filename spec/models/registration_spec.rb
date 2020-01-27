require "rails_helper"

RSpec.describe Registration, type: :model do
  before do
    @report = JSON.parse(File.read("spec/fixtures/json/report.json"))
    @report = @report.deep_symbolize_keys
    @application_instance = FactoryBot.create(:application_instance)
    @scorm_course = FactoryBot.create(:scorm_course)
    @user = FactoryBot.create(:user_canvas)
    @registration = FactoryBot.create(
      :registration,
      scorm_course: @scorm_course,
      user: @user,
      application_instance: @application_instance,
    )
  end

  describe "#store_activities" do
    it "stores scorm activites in the database" do
      expect(@registration.scorm_activities.count).to eq(0)
      @registration.store_activities(@report[:registrationreport][:activity])
      expect(@registration.scorm_activities.count).to eq(2)
    end
  end

  describe "#registration_data" do
    it "returns nil when scores don't exist under a registration" do
      expect(@registration.registration_data[:score]).to eq(nil)
    end
    it "returns the mean score for all scorm activities under a registration" do
      @registration.store_activities(@report[:registrationreport][:activity])
      expect(@registration.registration_data[:score]).to eq(1.0)
    end
  end

  describe "#activity_data" do
    it "gets the activity data" do
      @registration.store_activities(@report[:registrationreport][:activity])
      expect(@registration.activity_data.count).to eq(2)
    end

    it "sorts the root activities with right depths" do
      @registration.store_activities(@report[:registrationreport][:activity])
      activity_data = @registration.activity_data
      expect(activity_data[0][:activity_id]).to eq("golf_sample_default_org")
      expect(activity_data[1][:activity_id]).to eq("item_1")
      expect(activity_data[0][:depth]).to eq(0)
      expect(activity_data[1][:depth]).to eq(1)
    end
  end

  describe "#scorm_activities_count" do
    it "gets the scorm activity count" do
      @registration.store_activities(@report[:registrationreport][:activity])
      expect(@registration.scorm_activities_count).to eq(2)
    end
  end

  describe "#mean_registration_score" do
    it "gets the mean registration score" do
      @registration.store_activities(@report[:registrationreport][:activity])
      expect(@registration.mean_registration_score).to eq(1.0)
    end
  end

  describe "#registration_time_tracked" do
    it "gets the registration time tracked" do
      @registration.store_activities(@report[:registrationreport][:activity])
      expect(@registration.registration_time_tracked).to eq(1.0)
    end
  end

  describe "#mean_registration_time_tracked" do
    it "gets the mean registration time tracked" do
      @registration.store_activities(@report[:registrationreport][:activity])
      expect(@registration.mean_registration_time_tracked).to eq(0.5)
    end
  end

  describe "#passed?" do
    it "gets the passed?" do
      @registration.store_activities(@report[:registrationreport][:activity])
      expect(@registration.passed?).to eq(true)
    end
  end

  describe "#completion_statuses" do
    it "gets the completion statuses" do
      @registration.store_activities(@report[:registrationreport][:activity])
      expect(@registration.completion_statuses).to eq([false])
    end
  end

  describe "#all_completed?" do
    it "gets the all_completed?" do
      @registration.store_activities(@report[:registrationreport][:activity])
      expect(@registration.all_completed?).to eq(false)
    end
  end

  describe "#scores_statistics" do
    it "gets the scores statistics" do
      @registration.update_attributes(lms_course_id: @scorm_course.id)
      @registration.store_activities(@report[:registrationreport][:activity])
      course_analytics = @scorm_course.course_analytics
      course_scores = @registration.scores_statistics(course_analytics[:scores])
      expect(course_scores.count).to eq(7)
    end
  end
end
