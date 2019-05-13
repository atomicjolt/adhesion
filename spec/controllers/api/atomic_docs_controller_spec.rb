require "rails_helper"

RSpec.describe Api::AtomicDocsController, type: :controller do
  context "no api token" do
    describe "POST documents" do
      it "returns unauthorized" do
        post :documents
        expect(response).to have_http_status(401)
      end
    end

    describe "POST sessions" do
      it "returns unauthorized" do
        post :sessions
        expect(response).to have_http_status(401)
      end
    end
  end

  context "with api token" do
    before do
      @api_token = create(:api_token, name: "atomic-doc")

      request.headers["Authorization"] = @api_token.token
    end

    describe "POST documents" do
    end

    describe "POST sessions" do
    end

    describe "GET session_status" do
    end

    describe "GET view" do
    end

    describe "GET pdf_file" do
    end
  end
end
