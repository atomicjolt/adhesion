require "spec_helper"

describe AttendanceExportsHelper do
  before :each do
    @attendance = FactoryGirl.create(:attendance)
    @student = {}
    @student["id"] = 1
    @student["sortable_name"] = "Batman"
    @student["name"] = "Batman"
  end
  it "Builds the CSV Correctly" do
    csv = helper.generate_csv([@student], [@attendance])
    expect(csv).to eq("Name,2016-12-08\nBatman,present\n")
  end
end
