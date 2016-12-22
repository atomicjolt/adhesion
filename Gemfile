# If bundler starts to act up run these commands to start over and clean up:
# rm -rf ~/.bundle/ ~/.gem/; rm -rf $GEM_HOME/bundler/ $GEM_HOME/cache/bundler/; rm -rf .bundle/; rm -rf vendor/cache/; rm -rf Gemfile.lock
# rvm gemset empty Adhesion
# bundle install

source "https://rubygems.org"

# Bundle edge Rails instead: gem "rails", github: "rails/rails"
gem "rails", "4.2.7"

# Database
gem "pg"
gem "apartment"

# UI
gem "sass-rails"
gem "uglifier"
gem "autoprefixer-rails"
gem "non-stupid-digest-assets" # also compile assets without digest (fixes font problem)

# authentication, authorization, integrations
gem "devise"
gem "omniauth"
gem "omniauth-canvas"
gem "oauth", "~> 0.5.0"
gem "ims-lti", "~> 1.1.13" # IMS LTI tool consumers and providers
gem "cancancan"
gem "rolify"
gem "attr_encrypted"
gem "jwt", "~> 1.5.0" # json web token
gem "lms-api"

# Email
gem "sendgrid"

# JSON parser
gem "yajl-ruby", require: "yajl"

# deployment
gem "unicorn"
gem "unicorn-rails"

# API Related
gem "httparty"
gem "rack-cors", :require => "rack/cors"

# Paging
gem "will_paginate"

# Scorm cloud ruby client
gem "scorm_cloud", git: "https://github.com/instructure/scorm-cloud.git"

group :development do
  gem "spring"
  gem "better_errors"
  gem "binding_of_caller", :platforms => [:mri_21]
  gem "guard-bundler"
  gem "guard-rails"
  gem "guard-rspec"
  gem "hub", :require => nil
  gem "mail_view"
  gem "mailcatcher"
  gem "quiet_assets"
  gem "rails_apps_pages"
  gem "rails_apps_testing"
  gem "rails_layout"
  gem "rb-fchange", :require => false
  gem "rb-fsevent", :require => false
  gem "rb-inotify", :require => false
end

group :development, :test do
  gem "dotenv-rails"
  gem "byebug"
  gem "factory_girl_rails"
  gem "faker"
  gem "rspec-rails"
  gem "vcr"
  gem "coveralls", :require => false
end

group :test do
  gem "database_cleaner"
  gem "launchy"
  gem "shoulda-matchers"
  gem "webmock"
  gem "test_after_commit"
end

group :production do
  gem "capistrano", require: false
  gem "capistrano-rails", require: false
  gem "capistrano-bundler", require: false
  gem "capistrano3-unicorn", require: false
  gem "capistrano-shell", require: false
  gem "capistrano-logtail", require: false
  gem "capistrano-upload", require: false
  gem "capistrano-db-tasks", require: false
  gem "cap-ec2", require: false
  gem "capistrano-passenger", require: false
end
