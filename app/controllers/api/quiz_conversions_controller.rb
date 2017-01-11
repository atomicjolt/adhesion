class Api::QuizConversionsController < ApplicationController

  include Concerns::JwtToken
  include Concerns::CanvasSupport

  before_action :validate_token

  def create
    quiz_doc = get_quiz_doc

    answer_key = get_answer_key
    begin
      quiz = Word2Quiz.parse_quiz(quiz_doc, answer_key)

      api_params = {
        course_id: params[:lms_course_id]
      }

      response = canvas_api.proxy("CREATE_QUIZ", api_params, quiz: quiz.to_canvas)
      canvas_quiz = JSON.parse(response.body)

      api_params[:quiz_id] = canvas_quiz["id"]

      quiz.questions_as_canvas.each do |quiz_question|
        canvas_api.proxy(
          "CREATE_SINGLE_QUIZ_QUESTION",
          api_params,
          question: quiz_question,
        )
      end

      quiz_doc.close
      answer_key.close

      render status: 200, json: canvas_quiz
    rescue
      render status: 400, json: { message: "Something went wrong." }
    end
  end

  private

  def get_quiz_doc
    quiz_doc = Tempfile.new("quiz")
    quiz_doc.binmode
    quiz_doc.write(params[:quiz_doc].read)
    quiz_doc.rewind
    quiz_doc
  end

  def get_answer_key
    answer_key = Tempfile.new("answer")
    answer_key.binmode
    answer_key.write(params[:answer_key].read)
    answer_key.rewind
    answer_key
  end
end
