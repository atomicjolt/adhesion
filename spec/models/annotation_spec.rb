require "rails_helper"

RSpec.describe Annotation, type: :model do
  before do
    @user = FactoryBot.create(:user)
    @annotation_one = FactoryBot.create(:annotation, user: @user)
    @annotation_two = FactoryBot.create(:annotation, user: @user)

    @annotation_two_comment = @annotation_two.annotation_comments.create!(
      user: @user,
      annotation_id: @annotation_two.id,
      document_id: @annotation_two.document_id,
      content: "test annotation comment 2"
    )
    @annotation_two.last_comment_created_at = @annotation_two_comment.created_at
    @annotation_two.save!

    @annotation_one_comment = @annotation_one.annotation_comments.create!(
      user: @user,
      annotation_id: @annotation_one.id,
      document_id: @annotation_one.document_id,
      content: "test annotation comment 1"
    )
    @annotation_one.last_comment_created_at = @annotation_one_comment.created_at
    @annotation_one.save!
  end
  it "creates an annotation" do
    expect(@annotation_one).not_to be_nil
  end
  it "creates correct associations" do
    expect(@annotation_one.annotation_comments).not_to be_nil
    expect(@annotation_one.user).not_to be_nil
  end
  it "order by most recent comments" do
    annotations = Annotation.all.by_recent_comment
    expect(annotations.last.id).to eq(@annotation_one.id)
  end
end
