class Application < ActiveRecord::Base

  serialize :default_config, HashSerializer
  serialize :lti_config, HashSerializer
  serialize :canvas_api_permissions, HashSerializer

  has_many :application_instances
  validates :name, presence: true, uniqueness: true

  has_many :application_bundles
  has_many :bundles, through: :application_bundles

  store_accessor :default_config, :scorm_type

  # Kinds of Applications
  # lti: LTI tools. It's possible that these are also stand alone apps that
  #                 can be used outside of an LTI launch
  # admin: The admin tool
  # app: Stand alone applications that don't require an lti launch
  enum kind: %i{lti admin app}

  ADMIN = "adhesionadmin".freeze
  AUTH = "adhesionauth".freeze

  SCORM = "scorm".freeze
  ATTENDANCE = "attendance".freeze
  EXAMS = "exams".freeze
  EXAMPROCTOR = "examproctor".freeze
  QUIZCONVERTER = "quizconverter".freeze

  def create_instance(site: nil, bundle_instance: nil)
    application_instances.find_or_create_by(
      site: site,
      bundle_instance: bundle_instance,
    )
  end
end
