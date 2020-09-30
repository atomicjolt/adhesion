require "rails_helper"

RSpec.describe Api::TestingCentersAccountsController, type: :controller do
  before do
    setup_users
  end

  describe "GET index" do
    it "should get testing centers account based on canvas instance name" do
      request.headers["Authorization"] = @user_token
      TestingCentersAccount.create(
        canvas_instance_name: "Atomic Jolt",
        testing_centers_account_id: 1,
      )
      get :index, params: { canvas_instance_name: "Atomic Jolt" }, format: :json
      expect(JSON.parse(response.body)["testing_centers_account_id"]).to eq(1)
    end
  end
end
