require "rails_helper"

RSpec.describe ScormCourse, type: :model do
  describe "#regs" do
    before do
      @scorm_course = ScormCourse.create
    end

    it "sets registration" do
      expect(@scorm_course.regs.count).to eq(0)
    end

    it "sets registration" do
      registration = Registration.create(lms_course_id: @scorm_course.id)
      report = JSON.parse(File.read("spec/fixtures/json/report.json"))
      report = report.deep_symbolize_keys
      registration.store_activities(report[:registrationreport][:activity])
      expect(@scorm_course.regs.count).to eq(1)
    end
  end

  describe "#set_scorm_service_id" do
    it "should set the scorm_service_id" do
      scorm_course = ScormCourse.new
      expect(scorm_course.scorm_service_id).to eq(nil)
      scorm_course.save!
      expect(scorm_course.scorm_service_id).to eq(scorm_course.id.to_s)
    end
  end

  describe "course_analytics" do
    before do
      @scorm_course = ScormCourse.create
    end

    describe "without registration code" do
      it "should return the course analytics" do
        analytics = @scorm_course.course_analytics
        expect(analytics[:title]).to eq(@scorm_course.title)
        expect(analytics[:analytics_table].count).to eq(0)
        expect(analytics[:course_time_spent].count).to eq(0)
      end

      it "should test the scores" do
        analytics = @scorm_course.course_analytics
        expect(analytics[:scores].count).to eq(4)
        expect(analytics[:scores][0][:value]).to eq(0)
        expect(analytics[:scores][1][:value]).to eq(0)
        expect(analytics[:scores][2][:value]).to eq(nil)
        expect(analytics[:scores][3][:value]).to eq(nil)
      end

      it "should test the completed" do
        analytics = @scorm_course.course_analytics
        expect(analytics[:completed].count).to eq(2)
        expect(analytics[:completed][0][:value]).to eq(0)
        expect(analytics[:completed][1][:value]).to eq(0)
      end

      it "should test the pass_fail" do
        analytics = @scorm_course.course_analytics
        expect(analytics[:pass_fail].count).to eq(3)
        expect(analytics[:pass_fail][0][:value]).to eq(0)
        expect(analytics[:pass_fail][1][:value]).to eq(0)
        expect(analytics[:pass_fail][2][:value]).to eq(0)
      end

      it "should test the nav_buttons" do
        analytics = @scorm_course.course_analytics
        expect(analytics[:nav_buttons].count).to eq(4)
        expect(analytics[:nav_buttons][0][:stat]).to eq("0%")
        expect(analytics[:nav_buttons][1][:stat]).to eq("0%")
        expect(analytics[:nav_buttons][2][:stat]).to eq("0%")
        expect(analytics[:nav_buttons][3][:stat]).to eq(0)
      end
    end

    describe "with registration code" do
      before do
        registration = Registration.create(lms_course_id: @scorm_course.id)
        report = JSON.parse(File.read("spec/fixtures/json/report.json"))
        report = report.deep_symbolize_keys
        registration.store_activities(report[:registrationreport][:activity])
      end

      it "should return the course analytics with analytics table" do
        analytics = @scorm_course.course_analytics
        expect(analytics[:analytics_table].count).to eq(1)
        expect(analytics[:course_time_spent].count).to eq(1)
      end

      it "should test the scores" do
        analytics = @scorm_course.course_analytics
        expect(analytics[:scores].count).to eq(4)
        expect(analytics[:scores][0][:value]).to eq(1.0)
        expect(analytics[:scores][1][:value]).to eq(1.0)
        expect(analytics[:scores][2][:value]).to eq(1.0)
        expect(analytics[:scores][3][:value]).to eq(1.0)
      end

      it "should test the completed" do
        analytics = @scorm_course.course_analytics
        expect(analytics[:completed].count).to eq(2)
        expect(analytics[:completed][0][:value]).to eq(0)
        expect(analytics[:completed][1][:value]).to eq(1)
      end

      it "should test the pass_fail" do
        analytics = @scorm_course.course_analytics
        expect(analytics[:pass_fail].count).to eq(3)
        expect(analytics[:pass_fail].count).to eq(3)
        expect(analytics[:pass_fail][0][:value]).to eq(1)
        expect(analytics[:pass_fail][1][:value]).to eq(0)
        expect(analytics[:pass_fail][2][:value]).to eq(0)
      end

      it "should test the nav_buttons" do
        analytics = @scorm_course.course_analytics
        expect(analytics[:nav_buttons].count).to eq(4)
        expect(analytics[:nav_buttons][0][:stat]).to eq("0%")
        expect(analytics[:nav_buttons][1][:stat]).to eq("100%")
        expect(analytics[:nav_buttons][2][:stat]).to eq("100%")
        expect(analytics[:nav_buttons][3][:stat]).to eq(0)
      end
    end
  end

  describe "course_activities" do
    before do
      @scorm_course = ScormCourse.create
    end

    it "should return the course activities" do
      analytics = @scorm_course.course_analytics
      expect(analytics[:title]).to eq(@scorm_course.title)
      expect(analytics[:analytics_table].count).to eq(0)
    end

    it "should return the course activities with analytics table" do
      registration = Registration.create(lms_course_id: @scorm_course.id)
      report = JSON.parse(File.read("spec/fixtures/json/report.json"))
      report = report.deep_symbolize_keys
      registration.store_activities(report[:registrationreport][:activity])

      analytics = @scorm_course.course_analytics
      expect(analytics[:analytics_table].count).to eq(1)
    end

    it "should contain correct analytics table" do
      registration = Registration.create(lms_course_id: @scorm_course.id)
      report = JSON.parse(File.read("spec/fixtures/json/report.json"))
      report = report.deep_symbolize_keys
      registration.store_activities(report[:registrationreport][:activity])

      analytics = @scorm_course.course_analytics
      expect(analytics[:analytics_table][0][:score]).to eq(1.0)
      expect(analytics[:analytics_table][0][:passed]).to eq("Pass")
      expect(analytics[:analytics_table][0][:time]).to eq(1)
    end
  end
end
