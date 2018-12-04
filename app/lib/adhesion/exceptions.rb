module Adhesion
  module Exceptions
    class ScormImport < StandardError
      def initialize(msg = "Error with Scorm Import")
        super(msg)
      end
    end

    class ScormCanvasUpload < StandardError
      def initialize(msg = "Error with Scorm Canvas Upload")
        super(msg)
      end
    end

    class ScormCopyToStorage < StandardError
      def initialize(msg = "Error with copying to storage")
        super(msg)
      end
    end

    class PostResultsToLms < StandardError
      def initialize(msg = "A failure has occurred. Please try again.")
        super(msg)
      end
    end

    class ConcludeEnrollment < StandardError
      def initialize(msg = "Unable to conclude Enrollment")
        super(msg)
      end
    end
  end
end
