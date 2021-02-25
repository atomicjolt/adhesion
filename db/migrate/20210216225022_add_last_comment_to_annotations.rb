class AddLastCommentToAnnotations < ActiveRecord::Migration[5.2]
  def change
    add_column :annotations, :last_comment_created_at, :datetime
  end
end
