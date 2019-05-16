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

  describe "expires_at" do
    it "sets the expires_at" do
      atomic_doc_session = create(:atomic_doc_session)
      expect(atomic_doc_session.expires_at).to be_present
    end

    it "does not set the expires_at" do
      expires_at = 1.hour.from_now
      atomic_doc_session = create(:atomic_doc_session, expires_at: expires_at)
      expect(atomic_doc_session.expires_at.to_i).to eq(expires_at.to_i)
    end
  end

  describe "expired?" do
    it "returns true" do
      atomic_doc_session = create(:atomic_doc_session, expires_at: 1.hour.ago)
      expect(atomic_doc_session.expired?).to eq(true)
    end

    it "returns false" do
      atomic_doc_session = create(:atomic_doc_session, expires_at: 23.hours.from_now)
      expect(atomic_doc_session.expired?).to eq(false)
    end
  end
end
