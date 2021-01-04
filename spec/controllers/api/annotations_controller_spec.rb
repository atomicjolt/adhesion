require "rails_helper"

RSpec.describe Api::AnnotationsController, type: :controller do
  before do
    setup_users
    request.headers["Authorization"] = @user_token
    @annotations = FactoryBot.create_list(:annotation, 5)
  end

  describe "GET #index" do
    it "returns all annotations" do
      get :index, params: { document_id: @annotations.first[:document_id], page: @annotations.first[:page] }
      expect(response).to be_success
      annotations = JSON.parse(response.body)
      expect(annotations.count).to eq(5)
    end
  end

  describe "GET #show" do
    it "returns a single annotation" do
      id = @annotations.first[:id]
      document_id = @annotations.first[:document_id]
      get :show, params: {
        id: id,
        document_id: document_id,
      }
      expect(response).to be_success
      annotation = JSON.parse(response.body)
      expect(annotation["document_id"]).to eq(document_id)
      expect(annotation["id"]).to eq(id)
    end
  end

  describe "POST #create" do
    it "returns a new annotation" do
      document_id = FactoryBot.generate(:uuid)
      post :create, params: {
        document_id: document_id,
        page: 2,
        annotation: "{
          \"type\": \"drawing\",
          \"page\": 1,
          \"color\": \"000000\",
          \"width\": 1,
          \"lines\": [[113, 81],[115, 80]]
        }",
      }
      expect(response).to be_success
      annotation = JSON.parse(response.body)
      expect(annotation["document_id"]).to eq(document_id)
    end
  end

  describe "POST #update" do
    it "returns the updated annotation" do
      id = @annotations.first[:id]
      document_id = @annotations.first[:document_id]
      put :update, params: {
        id: id,
        document_id: document_id,
        page: 1,
        annotation: "{
          \"type\": \"drawing\"
        }",
      }
      expect(response).to be_success
      annotation = JSON.parse(response.body)
      expect(annotation["annotation_type"]).to eq("drawing")
    end
  end

  describe "GET #destroy" do
    it "returns nothing if annotation was deleted" do
      id = @annotations.first[:id]
      document_id = @annotations.first[:document_id]
      put :destroy, params: {
        id: id,
        document_id: document_id,
      }
      expect(response).to be_success
      expect(response.body).to be_empty
    end
  end
end
