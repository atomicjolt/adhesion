require "rails_helper"

RSpec.describe Api::CanvasUsersController, type: :controller do
  before do
    setup_application_instance

    user = create(:user)
    user.confirm
    request.headers["Authorization"] = AuthToken.issue_token(user_id: user.id)
  end

  describe "GET #index" do
    let(:params) do
      {
        canvas_account_id: 308,
        search_term: "johnson",
      }
    end

    it "returns matching users" do
      response = get(:index, params: params)
      parsed_response = JSON.parse(response.body)

      expect(parsed_response["matching_users"].first["name"]).to eq("George Washington")
      expect(parsed_response["matching_users"].last["name"]).to eq("Thomas Jefferson")
    end

    it "includes emails in user data" do
      response = get(:index, params: params)
      parsed_response = JSON.parse(response.body)

      expect(parsed_response["matching_users"].first["email"]).to eq("countryfather@revolution.com")
      expect(parsed_response["matching_users"].last["email"]).to eq("idodeclare@revolution.com")
    end

    it "returns the availability of a previous page" do
      response = get(:index, params: params)

      expect(JSON.parse(response.body)["previous_page_available"]).to eq(true)
    end

    it "returns the availability of a next page" do
      response = get(:index, params: params)

      expect(JSON.parse(response.body)["next_page_available"]).to eq(true)
    end
  end
end
