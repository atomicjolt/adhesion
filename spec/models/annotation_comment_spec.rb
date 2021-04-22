require "rails_helper"

RSpec.describe AnnotationComment, type: :model do
  before do
    @user = FactoryBot.create(:user)
    @annotation = FactoryBot.create(:annotation, user: @user)
    @annotation_comment = @annotation.annotation_comments.create!(
      user: @user,
      annotation_id: @annotation.id,
      document_id: @annotation.document_id,
      content: "test annotation comment"
    )
  end
  describe "create annotation comment" do
    it "creates an annotation comment" do
      expect(@annotation_comment.annotation_id).to eq(@annotation.id)
      expect(@annotation_comment.document_id).to eq(@annotation.document_id)
      expect(@annotation_comment.content).to eq("test annotation comment")
    end
    it "creates correct associations" do
      expect(@annotation_comment.annotation).not_to be_nil
      expect(@annotation_comment.user).not_to be_nil
    end
  end
end
