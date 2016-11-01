class Registration < ActiveRecord::Base
    belongs_to :courses
    belongs_to :users
    # has_one :lti_application
end
