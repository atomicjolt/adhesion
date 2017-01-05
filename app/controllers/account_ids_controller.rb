class AccountIdsController < ApplicationController
  include Concerns::JwtToken
  include Concerns::CanvasSupport
  before_action :validate_token

  def index
    byebug
    t=0

    # exams_list = TestingCenterId.where(root_account_id: params[:course_id], exam_id: params[:exam_id])


    # send_data(final_countdown_csv, filename: "export.csv")
  end
end
