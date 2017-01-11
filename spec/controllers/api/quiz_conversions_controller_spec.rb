require "rails_helper"
RSpec::Matchers.define :an_upload do |x|
  match { |actual| actual.name == x }
end

RSpec.describe Api::QuizConversionsController, type: :controller do
  before do
    @user = FactoryGirl.create(:user)
    @user.confirm
    @user_token = AuthToken.issue_token({ user_id: @user.id })
  end

  describe "POST create" do
    before do
      request.headers["Authorization"] = @user_token

      allow_any_instance_of(Api::QuizConversionsController).
        to receive(:get_quiz_doc).
        and_return(double(name: "fake doc", close: nil))

      allow_any_instance_of(Api::QuizConversionsController).
        to receive(:get_answer_key).
        and_return(double(name: "fake answer key", close: nil))

      @fake_quiz = double(
        to_canvas: {
          title: "asdf"
        },
        questions_as_canvas: [
          {
            text: "",
            answers: []
          }
        ]
      )

      allow(Word2Quiz).to receive(:parse_quiz).
        with(an_upload("fake doc"), an_upload("fake answer key")).
        and_return(@fake_quiz)

      @double = double(proxy: double(body: '{ "id": "1" }'))
      allow_any_instance_of(Concerns::CanvasSupport).
        to receive(:canvas_api).
        and_return(@double)
    end

    it "should parse the uploaded quiz" do
      expect(Word2Quiz).to receive(:parse_quiz).
        with(an_upload("fake doc"), an_upload("fake answer key")).
        and_return(@fake_quiz)

      post :create, {
        quiz_doc: nil,
        answer_key: @fake_doc,
        lms_course_id: 1,
      }
    end

    it "should create a quiz in canvas" do
      expect(@double).to receive(:proxy).with(
        "CREATE_QUIZ",
        { course_id: "1" },
        { quiz: { title: "asdf" } },
      ).and_return(double(body: '{ "id": "1" }'))

      post :create, {
        quiz_doc: nil,
        answer_key: @fake_doc,
        lms_course_id: 1,
      }
    end

    it "should create the quiz questions" do
      expect(@double).to receive(:proxy).with(
        "CREATE_SINGLE_QUIZ_QUESTION",
        { quiz_id: "1", course_id: "1" },
        { question: {   text: "", answers: [] } },
      ).once

      post :create, {
        quiz_doc: nil,
        answer_key: @fake_doc,
        lms_course_id: 1,
      }
    end
  end
end
