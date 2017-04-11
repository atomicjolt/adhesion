require "rails_helper"

RSpec.describe Attendance, type: :model do
  describe "valid?" do
    it "is true when status is PRESENT" do
      status = "PRESENT"
      attendance = build(:attendance, status: status)
      expect(attendance.valid?).to be true
    end

    it "is true when status is LATE" do
      status = "LATE"
      attendance = build(:attendance, status: status)
      expect(attendance.valid?).to be true
    end

    it "is true when status is ABSENT" do
      status = "ABSENT"
      attendance = build(:attendance, status: status)
      expect(attendance.valid?).to be true
    end

    it "is false when status is invalid" do
      status = "INVALID"
      attendance = build(:attendance, status: status)
      expect(attendance.valid?).to be false
    end
  end
end
