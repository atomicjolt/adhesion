module ExamExportHelper
  def self.generate_csv(exams)
    CSV.generate do |csv|
      csv << ['Exam Name', 'Student Name', 'Scheduled Date', 'Scheduled Time']
      exams.each do |exam|
        row = Array.new
        row << exam[:exam_name]
        row << exam[:student_name]
        row << exam[:scheduled_date]
        row << exam[:scheduled_time]
        csv << row
      end
    end
  end
end
