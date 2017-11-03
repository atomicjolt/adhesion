# Monkey patch the Uri Generic class find_proxy method
# We are removing code that attempts to resolve a host name
# without using the proxy so that the request doesn't time out.
URI::Generic.prepend CoreExtensions::Uri::Generic
