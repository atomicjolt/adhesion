class LtiLaunch < ApplicationRecord
  belongs_to :scorm_course, required: false
  has_secure_token
  serialize :config, HashSerializer
end
