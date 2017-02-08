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
              "satisfiedstatus" => "false"
            }
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
                  "satisfiedstatus" => "false"
                }
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
                  "audio_captioning" => "0"
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
                  "time_limit_action" => "Undefined"
                }
              },
              "children" => nil
            }
          }
        }
      }
    }
    @report = @report.deep_symbolize_keys
    @registration = Registration.create
  end

  describe "#store_activity" do
    it "stores scorm activites in the database" do
      expect(@registration.scorm_activities.count).to eq(0)
      @registration.store_activities(@report[:registrationreport][:activity])
      expect(@registration.scorm_activities.count).to eq(2)
    end
  end

  describe "#reg_score" do
    it "returns nil when scores don't exist under a registration" do
      expect(@registration.reg_score).to eq(nil)
    end
    it "returns the mean score for all scorm activities under a registration" do
      @registration.store_activities(@report[:registrationreport][:activity])
      expect(@registration.reg_score).to eq(1.0)
    end
  end

end
