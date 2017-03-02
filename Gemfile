# If bundler starts to act up run these commands to start over and clean up:
# rm -rf ~/.bundle/ ~/.gem/; rm -rf $GEM_HOME/bundler/ $GEM_HOME/cache/bundler/; rm -rf .bundle/; rm -rf vendor/cache/; rm -rf Gemfile.lock
# rvm gemset empty Adhesion
# bundle install

source "https://rubygems.org"

# Bundle edge Rails instead: gem "rails", github: "rails/rails"
gem "rails", "4.2.7"

# Database
gem "apartment"
gem "pg"

# authentication, authorization, integrations
gem "attr_encrypted"
gem "cancancan"
gem "devise"
gem "ims-lti", "~> 1.1.13" # IMS LTI tool consumers and providers
gem "jwt", "~> 1.5.0" # json web token
gem "lms-api", "~> 1.2.7"
gem "oauth", "~> 0.5.0"
gem "omniauth"
gem "omniauth-canvas", "~>1.0.1"
gem "rolify"

# Email
gem "sendgrid"

# JSON parser
gem "yajl-ruby", require: "yajl"

# deployment
gem "unicorn"
gem "unicorn-rails"

# API Related
gem "httparty"
gem "rest-client"
gem "rack-cors", require: "rack/cors"

# Paging
gem "will_paginate"

group :development do
  gem "autoprefixer-rails"
  gem "better_errors"
  gem "binding_of_caller", platforms: [:mri_21]
  gem "hub", require: nil
  gem "mailcatcher"
  gem "mail_view"
  gem "non-stupid-digest-assets" # also compile assets without digest (fixes font problem)
  gem "quiet_assets"
  gem "rails_apps_pages"
  gem "rails_apps_testing"
  gem "rails_layout"
  gem "rb-fchange", require: false
  gem "rb-fsevent", require: false
  gem "rb-inotify", require: false
  gem "sass-rails"
  gem "spring"
  gem "uglifier"
end

group :development, :test do
  gem "byebug"
  gem "coveralls", require: false
  gem "dotenv-rails"
  gem "factory_girl_rails"
  gem "faker"
  gem "rspec-rails"
  gem "rubocop"
end

group :test do
  gem "capybara"
  gem "database_cleaner"
  gem "launchy"
  gem "selenium-webdriver"
  gem "shoulda-matchers"
  gem "test_after_commit"
  gem "webmock"
end

### My Gems ###

group :development, :test do
  gem "vcr"
end

# serializers
gem "active_model_serializers", "~> 0.10.0"

# Scorm cloud ruby client
gem "scorm_cloud", git: "https://github.com/instructure/scorm-cloud.git"

# Word2Quiz for converting word doc quizzes
gem "word_2_quiz"

group :production do
  gem "cap-ec2", require: false
  gem "capistrano", require: false
  gem "capistrano-bundler", require: false
  gem "capistrano-db-tasks", require: false
  gem "capistrano-logtail", require: false
  gem "capistrano-passenger", require: false
  gem "capistrano-rails", require: false
  gem "capistrano-shell", require: false
  gem "capistrano-upload", require: false
  gem "capistrano3-unicorn", require: false
end
