require "rails_helper"

describe ApplicationController, type: :controller do
  controller do
    include Concerns::JwtToken

    before_action :validate_token
    respond_to :json

    def index
      render plain: "User: #{@user.display_name}"
    end

    def create
      render text: "I got created!"
    end
  end

  context "no authorization header" do
    it "should not be authorized" do
      get :index, format: :json
      expect(response).to have_http_status(:unauthorized)
    end
  end

  context "invalid authorization header" do
    it "should not be authorized" do
      request.headers["Authorization"] = "A fake header"
      get :index, format: :json
      expect(response).to have_http_status(:unauthorized)
    end
  end

  context "valid authorization header" do
    before do
      @user = FactoryGirl.create(:user)
      @user.confirm
      @user_token = AuthToken.issue_token({ user_id: @user.id })
      request.headers["Authorization"] = @user_token
    end
    it "should be authorized" do
      get :index, format: :json
      expect(response).to have_http_status(:success)
    end
  end
end
