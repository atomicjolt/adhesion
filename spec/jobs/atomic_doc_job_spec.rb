require "rails_helper"

RSpec.describe AtomicDocJob, type: :job do
  include ActiveJob::TestHelper

  after do
    clear_enqueued_jobs
  end

  subject { AtomicDocJob }

  let(:atomic_doc) { create(:atomic_doc) }

  let(:raw) { Object.new }

  let(:request) do
    Object.new
  end

  let(:url) do
    "https://www.example.com/123.docx"
  end

  let(:file) do
    Object.new
  end

  let(:path) do
    "/tmp/123.docx"
  end

  context "Job" do
    before do
      allow(request).to receive(:url).and_return(url)
      allow(raw).to receive(:request).and_return(request)
      allow(raw).to receive(:file).and_return(file)
      allow(file).to receive(:path).and_return(path)
      allow_any_instance_of(RestClient::Request).to receive(:execute).and_return(raw)
      allow(Libreconv).to receive(:convert)
    end

    it "processes" do
      _filename, extension = path.split(".")
      unless extension != "pdf"
        expect_any_instance_of(subject).to receive(:copy_to_storage).and_return("storage_path")

        expect do
          subject.perform_now(atomic_doc)
        end.to change { atomic_doc.file_path }.to("storage_path")
      end
    end
  end
end
