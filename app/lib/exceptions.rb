module Exceptions
  class ManifestMissing < StandardError
  end
  class LtiConfigMissing < StandardError
  end
  class InvalidImsccTokenError < StandardError
  end
  class InvalidApiTokenError < StandardError
  end
end
