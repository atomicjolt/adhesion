require "rails_helper"

RSpec.describe ExamRequest, type: :model do
  describe "scopes" do
    it "selects by_dates" do
      exam_request1 = create(:exam_request, scheduled_date: Date.today + 3.days)
      exam_request2 = create(:exam_request, scheduled_date: Date.today + 2.days)
      exam_request3 = create(:exam_request, scheduled_date: Date.today + 1.days)

      exam_dates = Date.today + 2.days..Date.today + 4.days
      exam_requests = ExamRequest.by_dates(exam_dates)
      expect(exam_requests).to include(exam_request1)
      expect(exam_requests).to include(exam_request2)
      expect(exam_requests).to_not include(exam_request3)
    end

    it "selects by_center_id" do
      exam_request1 = create(:exam_request, testing_center_id: 123)
      exam_request2 = create(:exam_request, testing_center_id: 345)
      exam_request3 = create(:exam_request, testing_center_id: 123)

      exam_requests = ExamRequest.by_center_id(123)
      expect(exam_requests).to include(exam_request1)
      expect(exam_requests).to_not include(exam_request2)
      expect(exam_requests).to include(exam_request3)
    end
  end
end
