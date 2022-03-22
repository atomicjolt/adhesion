class Api::ProctoredExamsController < Api::ApiApplicationController
  skip_before_action :validate_token
  include CanvasSupport

  respond_to :json

  def start_proctored_exam
    find_params = {
      student_id: params[:student_id],
    }

    find_params["status"] = "started" unless params[:unstarted]

    @exam_request = ExamRequest.find_by(find_params)

    if params[:update].present?
      finish_proctored_exam
      return
    end

    render json: { exam_request: @exam_request }
  end

  def update
    ExamRequest.find(params[:id]).
      update(
        unlocked_by_id: params[:proctor_id],
        unlocked_by_name: params[:proctor_name],
      )
    render json: { status: "ok" }
  end

  def finish_proctored_exam
    @exam_request.update(status: "finished")
    render json: { status: "ok" }
  end

end
