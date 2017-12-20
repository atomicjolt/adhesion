# Dirty hack until rack gem is > 2.0.3
# https://github.com/rack/rack/issues/1075
# The middleware approach was not reliable.
# Setting the const, in my tests, is always reliable.
Rack::Multipart::Parser.const_set("BUFSIZE", 1024 * 1024)

# Dirty hack to tell rack where to store multipart uploads
# On local it will be the regular tmpdir
# On production it will be the nfs mount
Rack::Multipart::Parser.const_set("TEMPFILE_FACTORY", lambda { |filename, _content_type|
  tmp_dir = if Rails.env.production?
              File.join(Rails.application.secrets.storage_mount, "tmp")
            else
              Dir.tmpdir
            end
  Tempfile.new(["RackMultipart", ::File.extname(filename.gsub("\0".freeze, "%00".freeze))], tmp_dir)
})
