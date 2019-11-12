class ApplicationJob < ActiveJob::Base
  queue_as :default

  Que.error_notifier = proc do |_error, job|
    if job[:error_count] > 17
      QueJob.find_by(job_id: job[:job_id])&.destroy
    end
  end
end
