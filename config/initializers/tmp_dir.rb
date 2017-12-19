# Override tmp dir for production deploys
class Dir
  class << self
    alias :old_tmpdir :tmpdir

    def tmpdir
      if Rails.env.production?
        File.join(Rails.application.secrets.storage_mount, "tmp")
      else
        old_tmpdir
      end
    end
  end
end
