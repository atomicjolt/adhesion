# config valid only for current version of Capistrano
lock '3.6.1'

set :application, 'adhesion'
set :repo_url, 'git@github.com:atomicjolt/adhesion.git'

#set :branch, -> { `git rev-parse --abbrev-ref HEAD`.chomp }
set :branch, :master

# Default deploy_to directory is /var/www/my_app_name
set :deploy_to, '/srv/www/adhesion'

# Default value for :scm is :git
# set :scm, :git

# Default value for :format is :airbrussh.
# set :format, :airbrussh

# You can configure the Airbrussh format using :format_options.
# These are the defaults.
# set :format_options, command_output: true, log_file: 'log/capistrano.log', color: :auto, truncate: :auto

# Default value for :pty is false
# set :pty, true

# Default value for :linked_files is []
append :linked_files, 'config/database.yml', 'config/secrets.yml'

# Default value for linked_dirs is []
 append :linked_dirs, 'log', 'vendor/bundle', 'tmp'

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for keep_releases is 5
# set :keep_releases, 5

set :unicorn_pid, "/tmp/unicorn.#{fetch(:application)}.pid"

set :logtail_files, %W( /srv/www/#{fetch(:application)}/current/log/#{fetch(:rails_env)}.log )
set :logtail_lines, 50

namespace :deploy do
  task :restart do
    invoke "touch /srv/www/#{fetch(:application)}/current/tmp/restart.txt"
  end
end
after 'deploy:published', 'deploy:restart'

# Clear existing task so we can replace it rather than "add" to it.
Rake::Task["deploy:compile_assets"].clear
Rake::Task["deploy:rollback_assets"].clear

namespace :deploy do
  desc 'Compile assets'
  task :compile_assets => [:set_rails_env] do
    set( :local_dir, "./public/#{fetch(:assets_prefix)}" )
    begin
      invoke 'deploy:assets:precompile_on_local'
      invoke 'deploy:assets:upload_precompiled_assets'
    ensure
      invoke 'deploy:assets:clean_up_precompiled_assets'
    end
  end

  namespace :assets do
    desc "Precompile assets locally"
    task :precompile_on_local do
      run_locally do
        execute "RAILS_ENV=#{fetch(:rails_env)} bundle exec rake assets:precompile"
      end
    end

    desc "Rsync precompiled assets to web servers"
    task :upload_precompiled_assets do
      # rsync to each server
      local_dir = fetch(:local_dir, "./public/#{fetch(:assets_prefix)}" )
      on roles( fetch(:assets_roles, [:web]) ) do
        # this needs to be done outside run_locally in order for host to exist
        remote_dir = "#{host.user}@#{host.hostname}:#{shared_path}/public"
        run_locally { execute "rsync -av --exclude='*.map' --delete #{local_dir} #{remote_dir}" }

        # Manifest stuff
        execute("mkdir -p #{File.join(release_path, 'config/assets')}")
        upload!("config/assets/rails-asset-manifest.json", File.join(release_path, "config/assets/rails-asset-manifest.json"))
        upload!("config/assets/webpack-asset-manifest.json", File.join(release_path, "config/assets/webpack-asset-manifest.json"))
      end
    end

    task :clean_up_precompiled_assets do
      # compile assets locally
      run_locally do
        local_dir = fetch(:local_dir, "./public/#{fetch(:assets_prefix)}" )
        run_locally { execute "rm -rf #{local_dir}" }
        run_locally { execute "rm -rf config/assets/*manifest.json" }
      end
    end
  end
end

namespace :deploy do
  desc "Symlinks the REVISION file into public as /sha"
  task :symlink_sha do
    on roles(:app) do
      execute "ln -nfs #{release_path}/REVISION #{release_path}/public/sha"
    end
  end
end
after 'deploy:publishing', 'deploy:symlink_sha'

