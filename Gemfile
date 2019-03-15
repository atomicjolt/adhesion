# If bundler starts to act up run these commands to start over and clean up:
# rm -rf ~/.bundle/ ~/.gem/; rm -rf $GEM_HOME/bundler/ $GEM_HOME/cache/bundler/; rm -rf .bundle/; rm -rf vendor/cache/; rm -rf Gemfile.lock
# rvm gemset empty Adhesion
# bundle install

source "https://rubygems.org"

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end

# Bundle edge Rails instead: gem "rails", github: "rails/rails"
gem "rails", "5.1.5"

# Database
gem "apartment"
gem "composite_primary_keys", "~> 10.0" # For que worker
gem "pg"

# authentication, authorization, integrations
gem "attr_encrypted"
gem "cancancan"
gem "devise"
gem "ims-lti", "~> 2.1.5" # IMS LTI tool consumers and providers
gem "aj-ims-lti", git: "https://github.com/atomicjolt/aj_lms_lti"
gem "jwt", "~> 1.5.0" # json web token
gem "lms-api", "~> 1.3.15"
gem "omniauth"
gem "omniauth-canvas", "~>1.0.2"
gem "rolify"

# Email
gem "sendgrid"

# JSON parser
gem "yajl-ruby", require: "yajl"

# server
gem "puma"

# job worker
gem "apartment-activejob-que"
gem "que"

# API Related
gem "rack-cors", require: "rack/cors"
gem "rest-client"

# Paging
gem "will_paginate"

# Application secrets checker
gem "nuclear_secrets"

group :development do
  # UI
  gem "autoprefixer-rails"
  gem "non-stupid-digest-assets" # also compile assets without digest (fixes font problem)
  gem "sass-rails"
  gem "uglifier"

  gem "better_errors"
  gem "binding_of_caller", platforms: [:mri_21]
  gem "hub", require: nil
  gem "mail_view"
  gem "rails_apps_pages"
  gem "rails_apps_testing"
  gem "rails_layout"
  gem "rb-fchange", require: false
  gem "rb-fsevent", require: false
  gem "rb-inotify", require: false
  # Access an IRB console on exception pages or by using <%= console %> anywhere in the code.
  gem "listen"
  gem "rails-erd"
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem "spring"
  gem "spring-commands-rspec"
  gem "spring-watcher-listen"
  gem "web-console"
end

group :development, :test do
  gem "byebug", platform: :mri
  gem "dotenv-rails"
  gem "factory_bot_rails"
  gem "faker"
  gem "guard-rspec", require: false
  gem "rails-controller-testing"
  gem "rspec-rails"
  gem "rubocop"
end

group :test do
  gem "capybara"
  gem "database_cleaner"
  gem "launchy"
  gem "selenium-webdriver"
  gem "shoulda-matchers"
  gem "webmock"
end

### My Gems ###

group :development, :test do
  gem "vcr"
end

# Scorm cloud ruby client
gem "scorm_cloud", git: "https://github.com/instructure/scorm-cloud.git"

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
