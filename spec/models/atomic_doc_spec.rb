require "rails_helper"

RSpec.describe AtomicDoc, type: :model do
  describe "status" do
    it "creates a status if one is not present" do
      atomic_doc = create(:atomic_doc, status: nil)
      expect(atomic_doc.status).to eq("queued")
    end

    it "does not create a status if one is present" do
      atomic_doc = create(:atomic_doc, status: "complete")
      expect(atomic_doc.status).to eq("complete")
    end
  end

  describe "old" do
    it "finds old atomic docs" do
      @atomic_doc1 = create(:atomic_doc)
      @atomic_doc2 = create(:atomic_doc, created_at: 4.days.ago)
      @atomic_doc3 = create(:atomic_doc)
      @atomic_doc4 = create(:atomic_doc, created_at: 9.days.ago)
      @atomic_doc1 = create(:atomic_doc, created_at: 1.days.ago)

      atomic_docs = AtomicDoc.old
      expect(atomic_docs.count).to eq(1)
      expect(atomic_docs).to include(@atomic_doc4)
    end
  end
end
