class Annotation < ApplicationRecord
  serialize :rectangles, Array
  serialize :lines, Array
  validates :document_id, presence: true
  has_many :annotation_comments, dependent: :destroy
  scope :by_recent_comment, -> { order(:last_comment_created_at) }

  belongs_to :user
end
