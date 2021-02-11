class Annotation < ApplicationRecord
  serialize :rectangles, Array
  serialize :lines, Array
  validates :document_id, presence: true
  has_many :annotation_comments, dependent: :destroy

  belongs_to :user
end
