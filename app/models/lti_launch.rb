class LtiLaunch < ApplicationRecord
  belongs_to :scorm_course
  has_secure_token
  serialize :config, HashSerializer
end
