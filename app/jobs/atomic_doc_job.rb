class AtomicDocJob < ApplicationJob
  queue_as :atomic_doc

  def perform(atomic_doc)
    atomic_doc.update(status: "working")

    raw = RestClient::Request.execute(
      method: :get,
      url: atomic_doc.url,
      raw_response: true,
    )

    escaped_filename = URI(raw.request.url).path.split("/").last
    full_filename = CGI.unescape(escaped_filename)
    filename, extension = full_filename.split(".")

    if extension != "pdf"
      file = Tempfile.new([filename, ".pdf"])

      PandocRuby.convert(
        [raw.file.path],
        from: extension.to_sym,
        o: "'#{file.path}' +RTS -K64m -RTS",
      )
    else
      file = raw.file
    end

    file_path = copy_to_storage(file, filename, atomic_doc)
    atomic_doc.update(
      file_path: file_path,
      status: "complete",
    )
  end

  def copy_to_storage(file, filename, atomic_doc)
    storage_mount = Rails.env.production? ? Rails.application.secrets.storage_mount : Dir.tmpdir
    duplicate_dir_path = File.join(storage_mount, "atomic_doc", atomic_doc.id.to_s)
    FileUtils.mkdir_p(duplicate_dir_path)
    duplicate_file_path = File.join(duplicate_dir_path, "#{filename}.pdf")

    pid = spawn("/bin/mv", file.path, duplicate_file_path)
    success = Process.wait(pid)
    raise Adhesion::Exceptions::AtomicDocCopyToStorage unless success

    file.close
    duplicate_file_path
  end
end
