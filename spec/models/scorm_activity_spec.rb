require "rails_helper"

RSpec.describe ScormActivity, type: :model do
  before do
    @scorm_activity = ScormActivity.create
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
  describe "#set_to_latest" do
    it "sets the last scorm activity to the latest attempt" do
      expect(@scorm_activity.latest_attempt).to eq(nil)
      @scorm_activity.set_to_latest
      expect(@scorm_activity.latest_attempt).to eq(true)
    end
  end

  describe "#update_with" do
    before do
      @report = JSON.parse(File.read("spec/fixtures/json/report.json"))
      @report = @report.deep_symbolize_keys
    end

    it "update with the activity" do
      expect(@scorm_activity.update_with(@report[:registrationreport][:activity])).to eq(nil)
      expect(@scorm_activity.satisfied).to eq(false)
      expect(@scorm_activity.completed).to eq(false)
      expect(@scorm_activity.suspended).to eq(false)
    end

    it "update with the activity runtime data" do
      @scorm_activity.update_with(@report[:registrationreport][:activity][:children][:activity])
      expect(@scorm_activity.score_scaled).to eq(1.0)
      expect(@scorm_activity.time_tracked).to eq(1)
      expect(@scorm_activity.total_time).to eq(120)
      expect(@scorm_activity.completion_status).to eq("incomplete")
      expect(@scorm_activity.score_raw).to eq(100.0)
      expect(@scorm_activity.score_min).to eq(0)
      expect(@scorm_activity.score_max).to eq(100.0)
      expect(@scorm_activity.success_status).to eq("Unknown")
      expect(@scorm_activity.lms_user_id).to eq(1)
      expect(@scorm_activity.lms_user_name).to eq("test@example.com")
    end
  end

  describe "#activity_data" do
    before do
      @report = JSON.parse(File.read("spec/fixtures/json/report.json"))
      @report = @report.deep_symbolize_keys
      @registration.store_activities(@report[:registrationreport][:activity])
    end

    it "should return the activity data" do
      scorm_activities = @registration.scorm_activities
      latest_activity = scorm_activities.select(&:latest_attempt)
      activities_data = latest_activity.first.activity_data(latest_activity, scorm_activities)
      expect(activities_data[:depth]).to eq(0)
      expect(activities_data[:activity_id]).to eq("golf_sample_default_org")
    end

    it "should return the activity data" do
      scorm_activities = @registration.scorm_activities
      latest_activity = scorm_activities.select(&:latest_attempt)
      activities_data = latest_activity.last.activity_data(latest_activity, scorm_activities)
      expect(activities_data[:depth]).to eq(1)
      expect(activities_data[:activity_id]).to eq("item_1")
    end
  end

  describe "#score_with_children" do
    before do
      @report = JSON.parse(File.read("spec/fixtures/json/report.json"))
      @report = @report.deep_symbolize_keys
      @registration.store_activities(@report[:registrationreport][:activity])
    end

    it "should return score" do
      scorm_activities = @registration.scorm_activities
      latest_activities = scorm_activities.select(&:latest_attempt)
      score = latest_activities.first.score_with_children(latest_activities)
      expect(score).to eq(1)
    end
  end

  describe "#all_attempts_time_tracked_children" do
    before do
      @report = JSON.parse(File.read("spec/fixtures/json/report.json"))
      @report = @report.deep_symbolize_keys
      @registration.store_activities(@report[:registrationreport][:activity])
    end

    it "should return time" do
      scorm_activities = @registration.scorm_activities
      latest_activities = scorm_activities.select(&:latest_attempt)
      time = latest_activities.first.all_attempts_time_tracked_children(latest_activities, scorm_activities)
      expect(time).to eq(1)
    end
  end
end
