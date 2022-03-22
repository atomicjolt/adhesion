require_relative "boot"
require_relative "../app/lib/oauth_state_middleware"

require "rails/all"
require "syslog/logger"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Adhesion
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 6.1

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")

    #
    ### Custom
    #

    config.autoload_paths << "#{config.root}/lib"

    config.action_dispatch.default_headers.delete("X-Frame-Options")

    config.middleware.insert_before 0, Rack::Cors do
      allow do
        origins "*"
        resource "*", headers: :any, methods: [:get, :post, :options]
      end
    end

    # Middleware that can restore state after an OAuth request
    config.middleware.insert_before 0, OauthStateMiddleware

    config.active_job.queue_adapter = :que

    config.webpack = {
      use_manifest: false,
      asset_manifest: {},
      common_manifest: {},
    }

    log_defaults = {
      "logger" => "rails",
      "log_level" => "debug",
    }
    log_config_path = Rails.root + "config/logging.yml"
    if File.exist?(log_config_path)
      log_config = YAML.load_file(log_config_path)[Rails.env]
    end

    log_config = log_defaults.merge(log_config || {})

    config.log_level = log_config["log_level"]

    # setting this to anything else will give you the default behavior
    if log_config["logger"] == "syslog"
      config.logger = ActiveSupport::TaggedLogging.new(
        Syslog::Logger.new("adhesion"),
      )
    end
  end
end
