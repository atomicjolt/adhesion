import React                   from 'react';
import { connect }             from 'react-redux';
import { getSingleQuiz }       from '../../../libs/canvas/constants/quizzes';
import canvasRequest           from '../../../libs/canvas/action';
import createListener          from '../../../libs/atomic_listener/listener_action';
import HoverButton             from '../common/hover_button';
import hashHistory             from '../../../history';

const select = (state, props) => ({
  quiz: state.proctorCodes.quizzes[props.params.quizId]
});

export class BaseEnterAnswers extends React.Component {

  static propTypes = {
    canvasRequest: React.PropTypes.func,
    quiz: React.PropTypes.shape({
      access_code: React.PropTypes.string,
    }),
    params: React.PropTypes.shape({
      courseId: React.PropTypes.string,
      userId: React.PropTypes.string,
      quizId: React.PropTypes.string,
    })
  }

  componentDidMount() {
    const { courseId, quizId, userId } = this.props.params;
    window.open(
      `https://09cba0af.ngrok.io/pt_login?user_id=${userId}&course_id=${courseId}&quiz_id=${quizId}`
    );
    this.props.canvasRequest(getSingleQuiz, { course_id: courseId, id: quizId });
    this.props.createListener(
      'api/canvas',
      { course_id: courseId, id: quizId },
      () => (false),
      () => (false),
      quizId,
      getSingleQuiz
    );
  }

  render() {
    const proctorCodeBox = {
      marginTop: '10px',
      padding: '10px',
      border: '1px solid grey',
      borderRadius: '4px',
      width: 'auto',
    };

    return (
      <div>
        <h1>Enter Answers</h1>
        <div>
          The exam should open in a new window.
          Please enter the proctor code below to begin entering answers.
        </div>
        <div style={proctorCodeBox}>
          { this.props.quiz ? this.props.quiz.access_code : 'Loading...' }
        </div>
        <div>
          <HoverButton onClick={() => hashHistory.push('/')}>Go Back</HoverButton>
        </div>
      </div>
    );
  }
}

export default connect(select, { canvasRequest, createListener })(BaseEnterAnswers);
