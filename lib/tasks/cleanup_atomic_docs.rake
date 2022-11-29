desc "Clean up old Atomic Docs"
task clean_up_atomic_docs: [:environment] do
  puts "Start cleaning"
  AtomicDoc.old.find_each do |atomic_doc|
    pid = spawn("/bin/rm", atomic_doc.file_path)
    success = Process.wait(pid)
    if success
      atomic_doc.destroy
    else
      puts "Atomic Doc file not found. id: #{atomic_doc.id}, file_path: #{atomic_doc.file_path}"
    end
  end
  puts "     DONE!"
end
