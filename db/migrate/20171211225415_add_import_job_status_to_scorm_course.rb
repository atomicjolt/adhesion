class AddImportJobStatusToScormCourse < ActiveRecord::Migration[5.0]
  def change
    add_column :scorm_courses, :import_job_status, :string
  end
end
