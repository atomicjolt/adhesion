class Annotation < ApplicationRecord
  serialize :rectangles, HashSerializer
  serialize :lines, HashSerializer

  belongs_to :user
end
