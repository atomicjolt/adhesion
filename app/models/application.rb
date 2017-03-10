class Application < ActiveRecord::Base
  serialize :default_config, HashSerializer

  has_many :application_instances
  validates :name, presence: true, uniqueness: true

  store_accessor :default_config, :scorm_type

  enum kind: [:lti, :admin]
end
