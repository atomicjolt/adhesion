class ScormActivity < ActiveRecord::Base
  belongs_to :parent_activity, :class_name => "ScormActivity"
  belongs_to :registration
  has_many :scorm_objectives
  has_many :child_activities, :class_name => "ScormActivity",
    :foreign_key => "parent_activity_id", :dependent => :destroy

end
