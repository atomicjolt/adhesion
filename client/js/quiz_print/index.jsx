import React                                from 'react';
import { connect }                          from 'react-redux';
import canvasRequest                        from '../libs/canvas/action';
import { getSingleQuiz }                    from '../libs/canvas/constants/quizzes';
import { listQuestionsInQuizOrSubmission }  from '../libs/canvas/constants/quiz_questions';

const select = state => ({
  loadingQuiz: state.print.loadingQuiz,
  loadingQuestions: state.print.loadingQuestions,
  quiz: state.print.quiz,
  questions: state.print.questions,
});

export class Index extends React.Component {
  static propTypes = {

  };

  constructor() {
    super();
  }

  componentWillMount() {
    const {courseId, quizId} = this.props.location.query;
    this.props.canvasRequest(getSingleQuiz, { course_id: courseId, id: quizId });
    this.props.canvasRequest(listQuestionsInQuizOrSubmission, { course_id: courseId, quiz_id: quizId });
  }

  render() {
    const { courseId, quizId } = this.props.location.query;
    const { quiz } = this.props;
    console.log(this.props.quiz);
    return (
      <div>
        <h2>{quiz.title}</h2>
      </div>
    );
  }
}

export default connect(select, { canvasRequest })(Index);
