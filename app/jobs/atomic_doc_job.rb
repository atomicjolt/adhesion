class AtomicDocJob < ApplicationJob
  queue_as :atomic_doc

  def perform(atomic_doc)
    raw = RestClient::Request.execute(
      method: :get,
      url: atomic_doc.url,
      raw_response: true,
    )
  end
end
