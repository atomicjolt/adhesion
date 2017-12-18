# Dirty hack until rack gem is > 2.0.3
# https://github.com/rack/rack/issues/1075
# The middleware approach was not reliable.
# Setting the const, in my tests, is always reliable.
# This makes large file uploads process MUCH faster
# The new rack code sets this to 1_048_576 so I think this
# hack is still a better approach for this scenario with
# huge scorm files.
Rack::Multipart::Parser.const_set("BUFSIZE", 100 * 1024 * 1024)
