module Adhesion
  module Exceptions
    class ScormImport < StandardError
      def initialize(msg = "Error with Scorm Import")
        super(msg)
      end
    end
  end
end
