require "rails_helper"

RSpec.describe Api::AtomicDocsController, type: :controller do
  include ActiveJob::TestHelper

  after do
    clear_enqueued_jobs
  end

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

      @url = "www.example.com/sha"
    end

    describe "POST documents" do
      it "returns authorized" do
        params = {
          url: @url,
        }
        post :documents, params: params
        expect(response).to have_http_status(200)
      end

      it "finds the existing document and returns that" do
        atomic_doc = create(:atomic_doc, url: @url, status: "queued")
        params = {
          url: @url,
        }
        post :documents, params: params
        body = JSON.parse(response.body)
        expect(body["id"]).to eq(atomic_doc.id)
        expect(body["status"]).to eq("queued")
      end

      it "enqueues an AtomicDocJob" do
        params = {
          url: @url,
        }
        expect do
          post :documents, params: params
        end.to have_enqueued_job(AtomicDocJob)
      end

      it "enqueues an AtomicDocJob with data" do
        atomic_doc = create(:atomic_doc, url: @url)
        params = {
          url: @url,
        }
        expect(AtomicDocJob).to receive(:perform_later).with(atomic_doc)
        post :documents, params: params
      end
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
