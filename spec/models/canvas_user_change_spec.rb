require "rails_helper"

RSpec.describe CanvasUserChange, type: :model do
  describe ".create_by_diffing_attrs!" do
    let(:admin_id) { 123 }
    let(:user_id) { 456 }
    let(:original_attrs) do
      {
        name: "Old John Adams",
        login_id: "adamsforindependence@greatbritain.com",
        sis_user_id: "old_john_123",
        email: "adamsforindependence@greatbritain.com",
      }
    end
    let(:new_attrs) do
      {
        name: "John Adams",
        login_id: "adamsforindependence@revolution.com",
        sis_user_id: "john_123",
        email: "adamsforindependence@revolution.com",
      }
    end

    before do
      @canvas_user_change = described_class.create_by_diffing_attrs!(
        admin_making_changes_lms_id: admin_id,
        user_being_changed_lms_id: user_id,
        original_attrs: original_attrs,
        new_attrs: new_attrs,
      )
    end

    it "creates a record in the database" do
      expect do
        described_class.create_by_diffing_attrs!(
          admin_making_changes_lms_id: admin_id,
          user_being_changed_lms_id: user_id,
          original_attrs: original_attrs,
          new_attrs: new_attrs,
        )
      end.to change(CanvasUserChange, :count).by(1)
    end

    it "populates the admin_making_changes_lms_id field" do
      expect(@canvas_user_change.admin_making_changes_lms_id).to eq(admin_id)
    end

    it "populates the user_being_changed_lms_id field" do
      expect(@canvas_user_change.user_being_changed_lms_id).to eq(user_id)
    end

    it "populates the name field" do
      expect(@canvas_user_change.name).to eq(
        "previous_value" => original_attrs[:name],
        "new_value" => new_attrs[:name],
        "success" => true,
      )
    end

    it "populates the login_id field" do
      expect(@canvas_user_change.login_id).to eq(
        "previous_value" => original_attrs[:login_id],
        "new_value" => new_attrs[:login_id],
        "success" => true,
      )
    end

    it "populates the sis_user_id field" do
      expect(@canvas_user_change.sis_user_id).to eq(
        "previous_value" => original_attrs[:sis_user_id],
        "new_value" => new_attrs[:sis_user_id],
        "success" => true,
      )
    end

    it "populates the email field" do
      expect(@canvas_user_change.email).to eq(
        "previous_value" => original_attrs[:email],
        "new_value" => new_attrs[:email],
        "success" => true,
      )
    end

    context "when an attribute is nil" do
      before do
        new_attrs.delete(:email)

        @canvas_user_change = described_class.create_by_diffing_attrs!(
          admin_making_changes_lms_id: admin_id,
          user_being_changed_lms_id: user_id,
          original_attrs: original_attrs,
          new_attrs: new_attrs,
        )
      end

      it "doesn't populate that field" do
        expect(@canvas_user_change.email).to be_nil
      end
    end

    context "when the new attribute is equal to the original attribute" do
      before do
        new_attrs[:email] = original_attrs[:email]

        @canvas_user_change = described_class.create_by_diffing_attrs!(
          admin_making_changes_lms_id: admin_id,
          user_being_changed_lms_id: user_id,
          original_attrs: original_attrs,
          new_attrs: new_attrs,
        )
      end

      it "doesn't populate that field" do
        expect(@canvas_user_change.email).to be_nil
      end
    end

    context "when the attribute is in the failed_attrs list" do
      before do
        @canvas_user_change = described_class.create_by_diffing_attrs!(
          admin_making_changes_lms_id: admin_id,
          user_being_changed_lms_id: user_id,
          original_attrs: original_attrs,
          new_attrs: new_attrs,
          failed_attrs: [:email],
        )
      end

      it "marks the attribute with success: false" do
        expect(@canvas_user_change.email["success"]).to be false
      end

      it "populates the failed_attributes field" do
        expect(@canvas_user_change.failed_attributes).to eq(["email"])
      end

      context "but the attribute is unchanged" do
        it "does not include that attribute in the failed_attributes field" do
          new_attrs[:email] = original_attrs[:email]

          canvas_user_change = described_class.create_by_diffing_attrs!(
            admin_making_changes_lms_id: admin_id,
            user_being_changed_lms_id: user_id,
            original_attrs: original_attrs,
            new_attrs: new_attrs,
            failed_attrs: [:email, :login_id],
          )

          expect(canvas_user_change.failed_attributes).to eq(["login_id"])
        end
      end
    end

    context "when the record is invalid" do
      it "raises an exception" do
        expect do
          described_class.create_by_diffing_attrs!(
            admin_making_changes_lms_id: nil,
            user_being_changed_lms_id: nil,
            original_attrs: original_attrs,
            new_attrs: new_attrs,
            failed_attrs: [:email],
          )
        end.to raise_error(ActiveRecord::RecordInvalid)
      end
    end
  end

  describe ".attr_changed?" do
    context "when the attribute has changed" do
      it "returns true" do
        changed = described_class.attr_changed?(
          { name: "Name" },
          { name: "New Name" },
          :name,
        )

        expect(changed).to be true
      end
    end

    context "when the attribute has not changed" do
      it "returns false" do
        changed = described_class.attr_changed?(
          { name: "Name" },
          { name: "Name" },
          :name,
        )

        expect(changed).to be false
      end
    end

    context "when the attribute is nil" do
      it "returns false" do
        changed = described_class.attr_changed?(
          { name: "Name" },
          {},
          :name,
        )

        expect(changed).to be false
      end
    end
  end

  describe "#failed_attributes?" do
    context "when the failed_attributes field is nil" do
      let(:canvas_user_change) do
        FactoryBot.create(:canvas_user_change, failed_attributes: nil)
      end

      it "returns false" do
        expect(canvas_user_change.failed_attributes?).to be false
      end
    end

    context "when the failed_attributes field is an empty array" do
      let(:canvas_user_change) do
        FactoryBot.create(:canvas_user_change, failed_attributes: [])
      end

      it "returns false" do
        expect(canvas_user_change.failed_attributes?).to be false
      end
    end

    context "when the failed_attributes field is not empty" do
      let(:canvas_user_change) do
        FactoryBot.create(:canvas_user_change, failed_attributes: [:email])
      end

      it "returns true" do
        expect(canvas_user_change.failed_attributes?).to be true
      end
    end
  end
end
