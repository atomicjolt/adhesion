module ExamExportHelper
  def self.generate_csv(exams)
    puts 123
    CSV.generate do |csv|
      csv << ["some header text"]
      csv << exams
    end
  end
end