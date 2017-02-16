require File.expand_path("../boot", __FILE__)

# Pick the frameworks you want:
require "active_model/railtie"
require "active_record/railtie"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_view/railtie"
require "sprockets/railtie"
require "syslog/logger"
# require "rails/test_unit/railtie"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Adhesion
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
    # Run "rake -D time" for a list of tasks for finding time zone names. Default is UTC.
    # config.time_zone = 'Central Time se(US & Canada)'

    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    # config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}').to_s]
    # config.i18n.default_locale = :de

    config.autoload_paths += Dir["#{config.root}/lib/**/"]

    config.action_dispatch.default_headers = {
      "X-Frame-Options" => "ALLOWALL",
    }

    config.middleware.insert_before 0, "Rack::Cors" do
      allow do
        origins "*"
        resource "*", headers: :any, methods: [:get, :post, :options]
      end
    end

    # Middleware that can restore state after an OAuth request
    config.middleware.insert_before 0, "OauthStateMiddleware"

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
