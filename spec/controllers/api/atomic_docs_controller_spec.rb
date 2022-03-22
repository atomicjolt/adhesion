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

    describe "DELETE documents" do
      it "returns unauthorized" do
        atomic_doc = create(:atomic_doc, url: @url)
        params = {
          id: atomic_doc.id,
        }
        delete :destroy, params: params
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
      before do
        @atomic_doc = create(:atomic_doc, url: @url, status: "queued")
      end

      it "returns authorized" do
        params = {
          url: @url,
        }
        post :sessions, params: params
        expect(response).to have_http_status(200)
      end

      it "creates a session" do
        params = {
          url: @url,
        }
        expect do
          post :sessions, params: params
        end.to change { AtomicDocSession.count }.by(1)
      end

      it "creates a session" do
        params = {
          url: @url,
        }
        post :sessions, params: params
        body = JSON.parse(response.body)
        expect(body["id"]).to be_present
      end

      it "returns invalid_session" do
        params = {
          url: "fake",
        }
        post :sessions, params: params
        expect(response).to have_http_status(403)
        body = JSON.parse(response.body)
        expect(body["error"]).to eq("invalid_session")
      end
    end

    describe "GET session_status" do
      it "returns authorized" do
        atomic_doc = create(:atomic_doc, status: "queued")
        session = create(:atomic_doc_session, atomic_doc: atomic_doc)

        params = {
          id: session.session_id,
        }
        get :session_status, params: params
        expect(response).to have_http_status(202)
      end

      it "returns document_not_ready" do
        atomic_doc = create(:atomic_doc, status: "queued")
        session = create(:atomic_doc_session, atomic_doc: atomic_doc)

        params = {
          id: session.session_id,
        }
        get :session_status, params: params
        body = JSON.parse(response.body)
        expect(body["error"]).to eq("document_not_ready")
      end

      it "returns a file path" do
        filename = "file.pdf"
        atomic_doc = create(:atomic_doc, status: "complete", file_path: "/tmp/#{filename}")
        session = create(:atomic_doc_session, atomic_doc: atomic_doc)

        params = {
          id: session.session_id,
        }
        get :session_status, params: params
        body = JSON.parse(response.body)
        expect(body["pdf_download_url"]).to eq("/api/atomic_docs/sessions/#{session.session_id}/file/#{filename}")
        expect(body["document_name"]).to eq(filename)
      end

      it "returns invalid session" do
        params = {
          id: "fake",
        }
        get :session_status, params: params
        expect(response).to have_http_status(403)
        body = JSON.parse(response.body)
        expect(body["error"]).to eq("invalid_session")
      end
    end

    describe "GET view" do
      it "returns authorized" do
        session = create(:atomic_doc_session)

        params = {
          id: session.session_id,
        }
        get :view, params: params
        expect(response).to have_http_status(200)
      end
    end

    describe "GET pdf_file" do
      it "returns authorized" do
        filename = "test.pdf"
        file_path = file_fixture(filename).realpath.to_s
        atomic_doc = create(:atomic_doc, status: "complete", file_path: file_path)
        session = create(:atomic_doc_session, atomic_doc: atomic_doc)

        params = {
          id: session.session_id,
        }
        get :pdf_file, params: params
        expect(response).to have_http_status(200)
        expect(response.headers["Content-Type"]).to eq("application/pdf")
        expect(response.headers["Content-Disposition"]).to eq("inline; filename=\"test.pdf\"; filename*=UTF-8''test.pdf")
      end

      it "returns invalid session" do
        params = {
          id: "fake",
        }
        get :pdf_file, params: params
        expect(response).to have_http_status(403)
        body = JSON.parse(response.body)
        expect(body["error"]).to eq("invalid_session")
      end
    end

    describe "DELETE destroy" do
      it "Deletes the atomic doc" do
        atomic_doc = create(:atomic_doc, url: @url)
        params = {
          id: atomic_doc.id,
        }
        delete :destroy, params: params
        expect(response).to have_http_status(200)
        expect do
          AtomicDoc.find(atomic_doc.id)
        end.to raise_error
      end
    end
  end
end
