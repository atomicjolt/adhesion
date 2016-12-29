class ProctorCodeSerializer < ActiveModel::Serializer
  attributes :id, :proctor_id, :code, :created_at, :updated_at
  has_one :assigned_exam
end
