require "libreconv"

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
      atomic_doc.update(
        status: "invalid_file_type",
      )
      return
      # TODO: Waiting on AU approval for LibrOffice conversion
      # file = Tempfile.new([filename, ".pdf"])
      # Libreconv.convert(raw.file.path, file.path)
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
    path_segments = URI(atomic_doc.url).path.split("/")
    lms_course_id = path_segments[2] || "unknown"
    lms_file_id = path_segments[4] || "unknown"
    duplicate_dir_path = File.join(storage_mount, "atomic_docs", lms_course_id, lms_file_id, atomic_doc.id.to_s)
    duplicate_file_path = File.join(duplicate_dir_path, "#{filename}.pdf")

    FileUtils.mkdir_p(duplicate_dir_path)

    pid = spawn("/bin/mv", file.path, duplicate_file_path)
    success = Process.wait(pid)
    raise Adhesion::Exceptions::AtomicDocCopyToStorage unless success

    file.close
    duplicate_file_path
  end
end
