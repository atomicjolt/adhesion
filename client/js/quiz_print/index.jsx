import React                                from 'react';
import { connect }                          from 'react-redux';
import canvasRequest                        from '../libs/canvas/action';
import { getSingleQuiz }                    from '../libs/canvas/constants/quizzes';
import { listQuestionsInQuizOrSubmission }  from '../libs/canvas/constants/quiz_questions';

import Loading    from './components/loading';
import Question   from './components/question';

const select = state => ({
  loadingQuiz: state.print.loadingQuiz,
  loadingQuestions: state.print.loadingQuestions,
  quiz: state.print.quiz,
  questions: state.print.questions,
});

export class Index extends React.Component {
  static propTypes = {
    location: React.PropTypes.shape({
      query: React.PropTypes.shape({
        courseId: React.PropTypes.string.isRequired,
        quizId: React.PropTypes.string.isRequired,
      }),
    }).isRequired,
    canvasRequest: React.PropTypes.func.isRequired,
    quiz: React.PropTypes.shape({}).isRequired,
    loadingQuiz: React.PropTypes.bool.isRequired,
    loadingQuestions: React.PropTypes.bool.isRequired,
  };

  componentWillMount() {
    const { courseId, quizId } = this.props.location.query;
    this.props.canvasRequest(getSingleQuiz, { course_id: courseId, id: quizId });
    this.props.canvasRequest(
      listQuestionsInQuizOrSubmission,
      { course_id: courseId, quiz_id: quizId }
    );
  }

  render() {
    const { quiz, loadingQuiz, loadingQuestions } = this.props;

    return (
      <div>
        {
          loadingQuiz || loadingQuestions || true ?
            <Loading
              loadingQuiz={loadingQuiz}
              loadingQuestions={loadingQuestions}
            /> : null
        }
        <h2>{quiz.title}</h2>
      </div>
    );
  }
}

export default connect(select, { canvasRequest })(Index);
