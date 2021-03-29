class AnnotationComment < ApplicationRecord
  belongs_to :annotation
  belongs_to :user
end
