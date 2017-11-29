class Course < ApplicationRecord
  has_many :authentications, dependent: :destroy, inverse_of: :course
end
