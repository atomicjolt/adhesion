require "rails_helper"

RSpec.describe Registration, type: :model do
  before do
    @report = {
      "registrationreport" => {
        "format" => "full",
        "regid" => "1",
        "instanceid" => "0",
        "activity" => {
          "id" => "golf_sample_default_org",
          "title" => "Golf Explained - Run-time Basic Calls",
          "satisfied" => "false",
          "completed" => "false",
          "progressstatus" => "true",
          "attemptprogressstatus" => "true",
          "attempts" => "1",
          "suspended" => "false",
          "objectives" => {
            "objective" => {
              "id" => "",
              "primary" => "true",
              "measurestatus" => "false",
              "normalizedmeasure" => "0.0",
              "progressstatus" => "false",
              "satisfiedstatus" => "false",
            },
          },
          "children" => {
            "activity" => {
              "id" => "item_1",
              "title" => "Golf Explained",
              "satisfied" => "false",
              "completed" => "false",
              "progressstatus" => "true",
              "attemptprogressstatus" => "true",
              "attempts" => "2",
              "suspended" => "false",
              "objectives" => {
                "objective" => {
                  "id" => "",
                  "primary" => "true",
                  "measurestatus" => "false",
                  "normalizedmeasure" => "0.0",
                  "progressstatus" => "false",
                  "satisfiedstatus" => "false",
                },
              },
              "runtime" => {
                "completion_status" => "incomplete",
                "credit" => "Credit",
                "entry" => "AbInitio",
                "exit" => "Unknown",
                "learnerpreference" => {
                  "audio_level" => "50.0",
                  "language" => nil,
                  "delivery_speed" => "1.0",
                  "audio_captioning" => "0",
                },
                "location" => "3",
                "mode" => "Normal",
                "progress_measure" => nil,
                "score_scaled" => "1.0",
                "score_raw" => "100.0",
                "score_min" => "0",
                "score_max" => "100.0",
                "total_time" => "0000:02:00",
                "timetracked" => "0000:00:01.89",
                "success_status" => "Unknown",
                "suspend_data" => "",
                "comments_from_learner" => nil,
                "comments_from_lms" => nil,
                "interactions" => nil,
                "objectives" => nil,
                "static" => {
                  "completion_threshold" => nil,
                  "launch_data" => nil,
                  "learner_id" => "1",
                  "learner_name" => "test@example.com",
                  "max_time_allowed" => nil,
                  "scaled_passing_score" => nil,
                  "time_limit_action" => "Undefined",
                },
              },
              "children" => nil,
            },
          },
        },
      },
    }
    @report = @report.deep_symbolize_keys
    @registration = Registration.create
  end

  describe "#student_course_analytics" do
    it "gets the summary put together" do
      scorm_course = ScormCourse.create
      @registration.update_attributes(lms_course_id: scorm_course.id)
      expect(@registration.student_course_analytics.count).to eq(8)
      expect(@registration.student_course_analytics[:title]).to eq("Scorm Title")
    end
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
      scorm_course = ScormCourse.create
      @registration.update_attributes(lms_course_id: scorm_course.id)
      @registration.store_activities(@report[:registrationreport][:activity])
      course_analytics = scorm_course.course_analytics
      course_scores = @registration.scores_statistics(course_analytics[:scores])
      expect(course_scores.count).to eq(5)
    end
  end
end
