require "rails_helper"

RSpec.describe Api::CanvasAccountUsersController, type: :controller do
  let(:lms_account_id) { "308" }
  let(:admin_lms_user_id) { "4567" }

  before do
    setup_application_instance

    admin = create(:user, lms_user_id: admin_lms_user_id)
    admin.confirm
    request.headers["Authorization"] = AuthToken.issue_token(
      application_instance_id: @application_instance.id,
      user_id: admin.id,
      lms_account_id: lms_account_id,
    )

    allow_any_instance_of(User).to receive(:lti_admin?).and_return(true)
  end

  describe "#validate_current_user_lti_admin" do
    context "when the user is an lti admin" do
      it "allows the request to continue" do
        allow_any_instance_of(User).to receive(:lti_admin?).and_return(true)

        response = get(:index, format: :json)

        expect(response.status).to eq(200)
      end
    end

    context "when the user is not an lti admin" do
      before do
        allow_any_instance_of(User).to receive(:lti_admin?).and_return(false)
      end

      it "returns a 401 unauthorized" do
        response = get(:index, format: :json)

        expect(response.status).to eq(401)
      end

      it "returns an error message" do
        response = get(:index, format: :json)

        expect(JSON.parse(response.body)["message"]).to match(/only account admins/i)
      end
    end
  end

  describe "GET #index" do
    let(:params) do
      { search_term: "johnson" }
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

  describe "GET show" do
    let(:params) do
      { id: "412" }
    end
    let(:user) do
      {
        "id" => 412,
        "name" => "John Adams",
        "login_id" => "adamsforindependence@greatbritain.com",
        "sis_user_id" => "old_john_123",
        "email" => "adamsforindependence@greatbritain.com",
      }
    end
    let(:mock_canvas_api) { double(LMS::Canvas) }

    before do
      allow_any_instance_of(Integrations::CanvasApiSupport).to receive(:api).
        and_return(mock_canvas_api)

      allow(mock_canvas_api).to receive(:proxy).
        with("SHOW_USER_DETAILS", id: params[:id]).
        and_return(user.clone)

      allow(mock_canvas_api).to receive(:api_get_request).
        with(a_string_matching(/users\?.*#{{ search_term: user["login_id"] }.to_query}/i)).
        and_return([user.clone])

      allow(mock_canvas_api).to receive(:proxy).
        with("LIST_ACCOUNTS", anything).
        and_return([])
    end

    it "returns a 200 OK" do
      response = get(:show, params: params)

      expect(response.status).to eq(200)
    end

    it "returns the user attributes" do
      response = get(:show, params: params)

      expect(JSON.parse(response.body)).to include(user)
    end

    it "returns whether or not the user is an account admin" do
      response = get(:show, params: params)

      expect(JSON.parse(response.body)["is_account_admin"]).to eq(false)
    end

    context "when the user is an account admin" do
      before do
        allow(mock_canvas_api).to receive(:proxy).
          with("LIST_ACCOUNTS", anything).
          and_return([{ "id" => 123, "name" => "Some Account" }])
      end

      it "returns true for is_account_admin" do
        response = get(:show, params: params)

        expect(JSON.parse(response.body)["is_account_admin"]).to eq(true)
      end
    end
  end

  describe "PUT update" do
    let(:params) do
      {
        id: "412",
        user: {
          name: "John Adams",
          login_id: "adamsforindependence@revolution.com",
          sis_user_id: "john_123",
          email: "adamsforindependence@revolution.com",
        },
      }
    end
    let(:original_user) do
      {
        "id" => 412,
        "name" => "Old School John Adams",
        "login_id" => "adamsforindependence@greatbritain.com",
        "sis_user_id" => "old_john_123",
        "email" => "adamsforindependence@greatbritain.com",
      }
    end
    let(:numeric_login_id) { 4989 }
    let(:mock_canvas_api) { double(LMS::Canvas) }

    before do
      allow_any_instance_of(Integrations::CanvasApiSupport).to receive(:api).
        and_return(mock_canvas_api)

      allow(mock_canvas_api).to receive(:proxy).
        with("SHOW_USER_DETAILS", id: params[:id]).
        and_return(original_user)

      allow(mock_canvas_api).to receive(:api_get_request).
        with(a_string_matching(/users\?.*#{{ search_term: original_user["login_id"] }.to_query}/i)).
        and_return([original_user])

      allow(mock_canvas_api).to receive(:proxy).
        with("LIST_ACCOUNTS", anything).
        and_return([])

      allow(mock_canvas_api).to receive(:api_put_request).
        with("users/#{params[:id]}", anything).
        and_return(
          { "name" => params[:user][:name], "email" => params[:user][:email] },
        )

      allow(mock_canvas_api).to receive(:proxy).
        with("LIST_USER_LOGINS_USERS", anything).
        and_return(
          [{
            "id" => numeric_login_id,
            "user_id" => original_user["id"],
            "unique_id" => original_user["login_id"],
            "sis_user_id" => original_user["sis_user_id"],
          }],
        )

      allow(mock_canvas_api).to receive(:api_put_request).
        with("accounts/#{lms_account_id}/logins/#{numeric_login_id}", anything).
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

    it "returns whether the user is an account admin" do
      response = put(:update, params: params)

      expect(JSON.parse(response.body)["is_account_admin"]).to eq(false)
    end

    it "creates a CanvasUserChange with the no failed attributes" do
      allow(CanvasUserChange).to receive(:create_by_diffing_attrs!)

      put(:update, format: :json, params: params)

      expect(CanvasUserChange).to have_received(:create_by_diffing_attrs!).
        with(
          admin_making_changes_lms_id: admin_lms_user_id,
          user_being_changed_lms_id: params[:id],
          original_attrs: original_user,
          new_attrs: params[:user],
          failed_attrs: [],
        )
    end

    context "when the user is an account admin" do
      before do
        allow(mock_canvas_api).to receive(:proxy).
          with("LIST_ACCOUNTS", anything).
          and_return([{ "id" => 123, "name" => "Some Account" }])
      end

      it "returns true for is_account_admin" do
        response = get(:show, params: params)

        expect(JSON.parse(response.body)["is_account_admin"]).to eq(true)
      end
    end

    context "when the user is not in the admin's account or sub-account" do
      before do
        allow(mock_canvas_api).to receive(:api_get_request).
          with(a_string_including("accounts/#{lms_account_id}/users")).
          and_return(OpenStruct.new({ parsed_response: [] }))
      end

      it "returns a 401 unauthorized" do
        response = put(:update, params: params)

        expect(response.status).to eq(401)
      end

      it "returns an error message" do
        response = put(:update, format: :json, params: params)

        expect(JSON.parse(response.body)["message"]).
          to match(/view or modify users from the current account/i)
      end
    end

    context "when the user is an admin in an account (any account)" do
      before do
        allow(mock_canvas_api).to receive(:proxy).
          with("LIST_ACCOUNTS", anything).
          and_return([{ "id" => 123, "name" => "Some Account" }])
      end

      it "returns a 401 unauthorized" do
        response = put(:update, params: params)

        expect(response.status).to eq(401)
      end

      it "returns an error message" do
        response = put(:update, format: :json, params: params)

        expect(JSON.parse(response.body)["message"]).
          to match(/has an admin role.* does not support updating admin users/i)
      end
    end

    context "when the edit user on Canvas request fails" do
      let(:exception_message) { "Something terrible happened." }

      before do
        allow(mock_canvas_api).to receive(:api_put_request).
          with("users/#{params[:id]}", anything).
          and_raise(LMS::Canvas::CanvasException, exception_message)
      end

      it "returns a 500 internal server error" do
        response = put(:update, format: :json, params: params)

        expect(response.status).to eq(500)
      end

      it "returns an error message" do
        response = put(:update, format: :json, params: params)

        expect(JSON.parse(response.body)["message"]).
          to match(/something went wrong.* updates were not persisted/i)
      end

      it "returns the exception" do
        response = put(:update, format: :json, params: params)

        expect(JSON.parse(response.body)["exception"]).to eq(exception_message)
      end

      it "creates a CanvasUserChange with the correct failed attributes" do
        allow(CanvasUserChange).to receive(:create_by_diffing_attrs!)

        put(:update, format: :json, params: params)

        expect(CanvasUserChange).to have_received(:create_by_diffing_attrs!).
          with(
            admin_making_changes_lms_id: admin_lms_user_id,
            user_being_changed_lms_id: params[:id],
            original_attrs: original_user,
            new_attrs: params[:user],
            failed_attrs: [:name, :email, :login_id, :sis_user_id],
          )
      end
    end

    context "when no matching login is found for the user on Canvas" do
      before do
        allow(mock_canvas_api).to receive(:proxy).
          with("LIST_USER_LOGINS_USERS", anything).
          and_return([])
      end

      it "returns a 500 internal server error" do
        response = put(:update, format: :json, params: params)

        expect(response.status).to eq(500)
      end

      it "returns an error message" do
        response = put(:update, format: :json, params: params)

        expect(JSON.parse(response.body)["message"]).
          to match(/something went wrong.* failed to find matching login/i)
      end

      it "returns the exception" do
        response = put(:update, format: :json, params: params)

        expect(JSON.parse(response.body)["exception"]).
          to match(/failed to find matching login.* #{params[:original_user_login_id]}/i)
      end

      it "creates a CanvasUserChange with the correct failed attributes" do
        allow(CanvasUserChange).to receive(:create_by_diffing_attrs!)

        put(:update, format: :json, params: params)

        expect(CanvasUserChange).to have_received(:create_by_diffing_attrs!).
          with(
            admin_making_changes_lms_id: admin_lms_user_id,
            user_being_changed_lms_id: params[:id],
            original_attrs: original_user,
            new_attrs: params[:user],
            failed_attrs: [:login_id, :sis_user_id],
          )
      end
    end

    context "when the edit user login on Canvas request fails" do
      let(:exception_message) { "A very bad thing occurred." }

      before do
        allow(mock_canvas_api).to receive(:api_put_request).
          with("accounts/#{lms_account_id}/logins/#{numeric_login_id}", anything).
          and_raise(LMS::Canvas::CanvasException, exception_message)
      end

      it "returns a 500 internal server error" do
        response = put(:update, format: :json, params: params)

        expect(response.status).to eq(500)
      end

      it "returns an error message" do
        response = put(:update, format: :json, params: params)

        expect(JSON.parse(response.body)["message"]).
          to match(/something went wrong.* those attributes were not updated/i)
      end

      it "returns the exception" do
        response = put(:update, format: :json, params: params)

        expect(JSON.parse(response.body)["exception"]).to eq(exception_message)
      end

      it "creates a CanvasUserChange with the correct failed attributes" do
        allow(CanvasUserChange).to receive(:create_by_diffing_attrs!)

        put(:update, format: :json, params: params)

        expect(CanvasUserChange).to have_received(:create_by_diffing_attrs!).
          with(
            admin_making_changes_lms_id: admin_lms_user_id,
            user_being_changed_lms_id: params[:id],
            original_attrs: original_user,
            new_attrs: params[:user],
            failed_attrs: [:login_id, :sis_user_id],
          )
      end
    end

    context "when not updating the name or email of the user" do
      before do
        params[:user][:name] = original_user["name"]
        params[:user][:email] = original_user["email"]
      end

      it "does not make the edit user call to the Canvas API" do
        expect(mock_canvas_api).to_not receive(:api_put_request).
          with("users/#{params[:id]}", anything)

        put(:update, format: :json, params: params)
      end

      it "returns the original user name" do
        response = put(:update, params: params)

        expect(JSON.parse(response.body)["name"]).to eq(original_user["name"])
      end

      it "returns the original user email" do
        response = put(:update, params: params)

        expect(JSON.parse(response.body)["email"]).to eq(original_user["email"])
      end
    end

    context "when not updating the login_id or sis_user_id" do
      before do
        params[:user][:login_id] = original_user["login_id"]
        params[:user][:sis_user_id] = original_user["sis_user_id"]
      end

      it "does not make the find user login call to the Canvas API" do
        expect(mock_canvas_api).to_not receive(:proxy).
          with("LIST_USER_LOGINS_USERS", anything)

        put(:update, format: :json, params: params)
      end

      it "does not make the edit user login call to the Canvas API" do
        expect(mock_canvas_api).to_not receive(:api_put_request).
          with("accounts/#{lms_account_id}/logins/#{numeric_login_id}", anything)

        put(:update, format: :json, params: params)
      end

      it "returns the original user login_id" do
        response = put(:update, params: params)

        expect(JSON.parse(response.body)["login_id"]).to eq(original_user["login_id"])
      end

      it "returns the original user sis_user_id" do
        response = put(:update, params: params)

        expect(JSON.parse(response.body)["sis_user_id"]).to eq(original_user["sis_user_id"])
      end
    end
  end
end
