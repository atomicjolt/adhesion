# Load DSL and set up stages
require "capistrano/setup"

# Include default deployment tasks
require "capistrano/deploy"

require 'capistrano/bundler'
require 'capistrano/rails/assets'
require 'capistrano/rails/migrations'

require 'capistrano/shell' # https://rubygems.org/gems/capistrano-shell

require 'capistrano/logtail' # https://github.com/ydkn/capistrano-logtail

require 'capistrano/upload' # https://github.com/Reiknistofa/capistrano-upload

require 'capistrano/passenger'


# Load custom tasks from `lib/capistrano/tasks` if you have any defined
Dir.glob("lib/capistrano/tasks/*.rake").each { |r| import r }
