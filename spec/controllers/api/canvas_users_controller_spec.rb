require "rails_helper"

RSpec.describe Api::CanvasUsersController, type: :controller do
  before do
    setup_application_instance

    user = create(:user)
    user.confirm
    request.headers["Authorization"] = AuthToken.issue_token(user_id: user.id)

    allow_any_instance_of(User).to receive(:lti_admin?).and_return(true)
  end

  describe "#validate_current_user_lti_admin" do
    context "when the user is an lti admin" do
      it "allows the request to continue" do
        allow_any_instance_of(User).to receive(:lti_admin?).and_return(true)

        response = get(:index, format: :json, params: { canvas_account_id: 308 })

        expect(response.status).to eq(200)
      end
    end

    context "when the user is not an lti admin" do
      before do
        allow_any_instance_of(User).to receive(:lti_admin?).and_return(false)
      end

      it "returns a 401 unauthorized" do
        response = get(:index, format: :json, params: { canvas_account_id: 308 })

        expect(response.status).to eq(401)
      end

      it "returns an error message" do
        response = get(:index, format: :json, params: { canvas_account_id: 308 })

        expect(JSON.parse(response.body)["message"]).to match(/only account admins/i)
      end
    end
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

  describe "PUT update" do
    let(:params) do
      {
        canvas_account_id: "308",
        id: "412",
        original_user_login_id: "adamsforindepence@greatbritain.com",
        user: {
          name: "John Adams",
          login_id: "adamsforindependence@revolution.com",
          sis_user_id: "john_123",
          email: "adamsforindependence@revolution.com",
          password: "new_password",
        },
      }
    end
    let(:numeric_login_id) { 4989 }

    before do
      allow_any_instance_of(LMS::Canvas).to receive(:api_put_request).
        with("users/#{params[:id]}", anything).
        and_return(
          { "name" => params[:user][:name], "email" => params[:user][:email] },
        )

      allow_any_instance_of(LMS::Canvas).to receive(:proxy).
        with("LIST_USER_LOGINS_USERS", anything).
        and_return(
          [{
            "id" => numeric_login_id,
            "user_id" => params[:id],
            "unique_id" => params[:original_user_login_id],
            "sis_user_id" => "#{params[:user][:sis_user_id]}(old)",
          }],
        )

      allow_any_instance_of(LMS::Canvas).to receive(:api_put_request).
        with("accounts/#{params[:canvas_account_id]}/logins/#{numeric_login_id}", anything).
        and_return(
          {
            "id" => numeric_login_id,
            "user_id" => params[:id],
            "unique_id" => params[:user][:login_id],
            "sis_user_id" => params[:user][:sis_user_id],
          },
        )
    end

    it "returns a 200 OK" do
      response = put(:update, params: params)

      expect(response.status).to eq(200)
    end

    it "returns the user ID" do
      response = put(:update, params: params)

      expect(JSON.parse(response.body)["id"]).to eq(params[:id])
    end

    it "returns the user name" do
      response = put(:update, params: params)

      expect(JSON.parse(response.body)["name"]).to eq(params[:user][:name])
    end

    it "returns the user login_id" do
      response = put(:update, params: params)

      expect(JSON.parse(response.body)["login_id"]).to eq(params[:user][:login_id])
    end

    it "returns the user sis_user_id" do
      response = put(:update, params: params)

      expect(JSON.parse(response.body)["sis_user_id"]).to eq(params[:user][:sis_user_id])
    end

    it "returns the user email" do
      response = put(:update, params: params)

      expect(JSON.parse(response.body)["email"]).to eq(params[:user][:email])
    end

    context "when the user is not in the admin's account or sub-account" do
      before do
        allow_any_instance_of(LMS::Canvas).to receive(:api_get_request).
          with(a_string_including("accounts/#{params[:canvas_account_id]}/users")).
          and_return(OpenStruct.new({ parsed_response: [] }))
      end

      it "returns a 401 unauthorized" do
        response = put(:update, params: params)

        expect(response.status).to eq(401)
      end

      it "returns an error message" do
        response = put(:update, format: :json, params: params)

        expect(JSON.parse(response.body)["message"]).
          to match(/modify users from the account/i)
      end
    end
  end
end
