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
end
