class AssignedExam < ActiveRecord::Base
  has_many :proctor_codes, dependent: :destroy
end
