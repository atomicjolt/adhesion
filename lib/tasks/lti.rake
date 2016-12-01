namespace :lti do

  # Run this task from a background process to remove all values from the nonces table.
  desc "Remove old nonces from the database"
  task :clean do
    Nonce.clean
  end

  desc "Get basic LTI configuration for all installed LTI applications."
  task :configs => :environment do |t|
    Lti::Utils.lti_configs
  end

  desc "Generate LTI test params. Call using: rake lti_test_params['lti_launch_url'] where lti_launch_url is the lti launch url"
  task :test_params, [:lti_launch_url] => :environment do |t, args|
    require File.join(File.dirname(__FILE__), "../../spec/support/lti.rb")
    url = args[:code] || "https://www.example.com/lti/launch"

    puts "LTI key: #{oauth_consumer_key}"
    puts "LTI secret: #{oauth_consumer_secret}"
    puts "--------------------------------------"
    puts lti_params({"launch_url" => url}).to_json
  end

  desc "Remove all installs of the LTI tools"
  task :destroy_all => :environment do |t|
    Lti::Utils.destroy_all
  end

  desc "List all installed LTI tools"
  task :list_all => :environment do |t|
    Lti::Utils.list_all
  end

  desc "Update the authorized endpoints"
  task scorm_endpoints: :environment do ||
    puts "SETTING AUTHORIZED CANVAS ENDPOINTS"
    apps = LtiApplication.where(client_application_name: "scorm")
    permissions = "CREATE_ASSIGNMENT,DELETE_ASSIGNMENT,LIST_ASSIGNMENTS"
    apps.each do |app|
      app.update(canvas_api_permissions: permissions)
    end
  end
end
