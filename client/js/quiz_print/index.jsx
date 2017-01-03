import React                                from 'react';
import { connect }                          from 'react-redux';
import _                                    from 'lodash';
import canvasRequest                        from '../libs/canvas/action';
import { getSingleQuiz }                    from '../libs/canvas/constants/quizzes';
import { listQuestionsInQuizOrSubmission }  from '../libs/canvas/constants/quiz_questions';

import Loading    from './components/loading';
import QuizInfo   from './components/quiz_info';
import Question   from './components/question';

const select = (state, props) => {
  const { quizId } = props.location.query;
  return {
    loadingQuiz: state.print.loadingQuiz,
    quiz: state.print.quizzes[quizId] || {},
    questions: state.print.questions[quizId] || {},
  };
};

export class Index extends React.Component {
  static propTypes = {
    location: React.PropTypes.shape({
      query: React.PropTypes.shape({
        courseId: React.PropTypes.string.isRequired,
        quizId: React.PropTypes.string.isRequired,
      }),
    }).isRequired,
    canvasRequest: React.PropTypes.func.isRequired,
    quiz: React.PropTypes.shape({}),
    loadingQuiz: React.PropTypes.bool.isRequired,
    questions: React.PropTypes.shape({}),
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
    const { quiz, questions, loadingQuiz } = this.props;

    return (
      <div>
        {
          loadingQuiz || _.size(questions) < quiz.question_count ?
            <Loading
              loadingQuiz={loadingQuiz}
            /> : null
        }
        <QuizInfo {...quiz} />
        {
          _.map(questions, question => <Question key={`question_${question.id}`} {...question} />)
        }
      </div>
    );
  }
}

export default connect(select, { canvasRequest })(Index);
