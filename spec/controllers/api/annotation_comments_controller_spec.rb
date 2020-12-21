require "rails_helper"

RSpec.describe Api::AnnotationCommentsController, type: :controller do
  before do
    setup_users
    request.headers["Authorization"] = @user_token
    @annotation = FactoryBot.create(:annotation)
  end

  describe "Associaction test" do
    it "creates an annotation_comment associated with an annotation" do
      comment = AnnotationComment.create(annotation: @annotation)
      expect(@annotation.annotation_comments.count).to eq(1)
      expect(comment["annotation_id"]).to eq(@annotation["id"])
    end
  end

  describe "POST #create" do
    it "returns a new comment" do
      annotation_id = @annotation[:id]
      document_id = @annotation[:document_id]
      post :create, params: {
        annotation_id: annotation_id,
        document_id: document_id,
        content: "This is an annotation comment",
      }
      expect(response).to be_success
      comment = JSON.parse(response.body)
      expect(comment["content"]).to eq("This is an annotation comment")
    end
  end

  describe "PUT #destroy" do
    it "returns nothing if annotation was deleted" do
      comment = AnnotationComment.create(annotation: @annotation, document_id: @annotation[:document_id])
      document_id = @annotation[:document_id]
      put :destroy, params: {
        id: comment[:id],
        document_id: document_id,
      }
      expect(response).to be_success
      expect(response.body).to be_empty
    end
  end
end
