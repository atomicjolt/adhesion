class Api::QuizConversionsController < ApplicationController

  include Concerns::JwtToken
  include Concerns::CanvasSupport

  before_action :validate_token

  def create
    quiz_doc = get_quiz_doc
    answer_key = get_answer_key

    begin
      quiz = Word2Quiz.parse_quiz(quiz_doc.path, answer_key.path)

      api_params = {
        course_id: params[:lms_course_id],
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

      # Canvas doesn't set question count or points correctly when creating a
      # quiz for some reason, but an empty update makes it calculate them from
      # the questions.
      canvas_api.proxy(
        "EDIT_QUIZ",
        {
          course_id: params[:lms_course_id],
          id: canvas_quiz["id"],
        },
        quiz: {},
      )

      quiz_doc.close
      answer_key.close

      render status: 200, json: canvas_quiz
    rescue Word2Quiz::InvalidAnswerKey, Word2Quiz::InvalidQuiz => e
      render status: 400, json: { message: e.message }
    rescue => e
      Rails.logger.error("message: #{e.message} \n backtrace: #{e.backtrace.join("\n")}")
      render status: 400, json: { message: "An unknown error has ocurred." }
    end
  end

  private

  def get_quiz_doc
    quiz_doc = Tempfile.new(["quiz", ".docx"])
    quiz_doc.binmode
    quiz_doc.write(params[:quiz_doc].read)
    quiz_doc.rewind
    quiz_doc
  end

  def get_answer_key
    answer_key = Tempfile.new(["answer", ".doc"])
    answer_key.binmode
    answer_key.write(params[:answer_key].read)
    answer_key.rewind
    answer_key
  end
end
