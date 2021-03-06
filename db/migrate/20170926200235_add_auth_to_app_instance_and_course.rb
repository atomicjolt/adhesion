class AddAuthToAppInstanceAndCourse < ActiveRecord::Migration[5.0]
  def change
    unless column_exists? :authentications, :application_instance_id
      add_column :authentications, :application_instance_id, :integer
    end
    unless column_exists? :authentications, :course_id
      add_column :authentications, :course_id, :integer
    end
  end
end
