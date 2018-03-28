require "spec_helper"

describe AttendanceExportsHelper do
  before :each do
    @attendance = FactoryBot.create(:attendance)
  end
  it "Builds the CSV Correctly" do
    csv = AttendanceExportsHelper.generate_csv([@attendance])
    expect(csv).to eq("Name,2016-12-08\n" + @attendance.name + ",present\n")
  end
end
