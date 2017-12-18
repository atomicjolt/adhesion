# Dirty hack until rack gem is > 2.0.3
# https://github.com/rack/rack/issues/1075
# The middleware approach was not reliable.
# Setting the const, in my tests, is always reliable.
Rack::Multipart::Parser.const_set("BUFSIZE", 1024 * 1024)
