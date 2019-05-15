require "rails_helper"

RSpec.describe ApiToken, type: :model do
  describe "valid?" do
    it "is true when name is present" do
      name = "aoeu1234"
      api_token = create(:api_token, name: name)
      expect(api_token.valid?).to be true
    end

    it "is false for missing name" do
      api_token = build(:api_token, name: nil)
      expect(api_token.valid?).to be false
    end
  end

  describe "token" do
    it "creates a token if one is not present" do
      api_token = create(:api_token, token: nil)
      expect(api_token.token).to be_present
    end

    it "does not create a token if one is present" do
      api_token = create(:api_token, token: "123abc")
      expect(api_token.token).to eq("123abc")
    end
  end
end
