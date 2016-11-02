class Registration < ActiveRecord::Base
    belongs_to :courses
    belongs_to :users
    belongs_to :lti_application
end
