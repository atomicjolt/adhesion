require "rails_helper"

RSpec.describe AtomicDocSession, type: :model do
  describe "session_id" do
    it "creates a session_id if one is not present" do
      atomic_doc_session = create(:atomic_doc_session, session_id: nil)
      expect(atomic_doc_session.session_id).to be_present
    end

    it "does not create a session_id if one is present" do
      atomic_doc_session = create(:atomic_doc_session, session_id: "123abc")
      expect(atomic_doc_session.session_id).to eq("123abc")
    end
  end
end
