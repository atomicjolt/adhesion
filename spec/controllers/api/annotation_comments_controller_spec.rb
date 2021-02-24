require "rails_helper"

RSpec.describe Api::AnnotationCommentsController, type: :controller do
  before do
    setup_users
    request.headers["Authorization"] = @user_token
    @annotation = FactoryBot.create(:annotation)
    @annotation_id = @annotation[:id]
    @document_id = @annotation[:document_id]
    params = {
      user: @user,
      annotation_id: @annotation_id,
      document_id: @document_id,
      content: "this is an annotation comment"
    }
    @comment = @annotation.annotation_comments.create!(params)
  end

  describe "GET #index" do
    it "returns associated comments" do
      get :index, params: {
        annotation_id: @annotation_id,
        document_id: @document_id,
      }
      expect(response).to be_success
      comments = JSON.parse(response.body)
      expect(comments.count).to eq(1)
    end
  end

  describe "POST #create" do
    it "returns a new comment" do
      post :create, params: {
        annotation_id: @annotation_id,
        document_id: '5678',
        content: "This is an annotation comment",
      }
      expect(response).to be_success
      comment = JSON.parse(response.body)
      expect(comment["content"]).to eq("This is an annotation comment")
    end
  end

  describe "PUT #destroy" do
    it "returns nothing if annotation was deleted" do
      put :destroy, params: {
        id: @comment[:id],
        document_id: @document_id,
      }
      expect(response).to be_success
      expect(response.body).to be_empty
    end
  end
end
