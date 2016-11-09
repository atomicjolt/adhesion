class Registration < ActiveRecord::Base
    belongs_to :courses
    belongs_to :users
    belongs_to :lti_application
    before_create :set_scorm_cloud_passback_secret
    
  def set_scorm_cloud_passback_secret
    self.scorm_cloud_passback_secret = ::SecureRandom::hex(64)
  end
end
