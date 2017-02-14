import React                   from 'react';
import { connect }             from 'react-redux';
import _                       from 'lodash';
import { getSingleQuiz }       from '../../../libs/canvas/constants/quizzes';
import canvasRequest           from '../../../libs/canvas/action';
import createListener          from '../../../libs/atomic_listener/listener_action';
import { getSignedUrl }        from '../../actions/exam_requests';
import HoverButton             from '../common/hover_button';
import hashHistory             from '../../../history';

const select = (state, props) => {
  const examRequest = _.find(
    state.examRequests.examRequestList,
    request => request.id.toString() === props.params.examRequestId
  );
  return {
    quiz: state.examRequests.quizzes[examRequest.exam_id],
    signedUrl: state.examRequests.signedUrl,
    examRequest,
  };
};

export class BaseEnterAnswers extends React.Component {

  static propTypes = {
    // createListener: React.PropTypes.func,
    canvasRequest: React.PropTypes.func,
    quiz: React.PropTypes.shape({
      access_code: React.PropTypes.string,
    }),
    params: React.PropTypes.shape({
      courseId: React.PropTypes.string,
      userId: React.PropTypes.string,
      quizId: React.PropTypes.string,
      examRequestId: React.PropTypes.string,
    }),
    getSignedUrl: React.PropTypes.func,
    signedUrl: React.PropTypes.string,
  }

  static getStyles() {
    return {
      proctorCodeBox: {
        marginTop: '10px',
        padding: '10px',
        border: '1px solid grey',
        borderRadius: '4px',
        width: 'auto',
      }
    };
  }

  // this wont work unless you are on my instance of canvas.
  componentDidMount() {
    const { examRequestId } = this.props.params;
    const { examRequest } = this.props;

    this.props.getSignedUrl(examRequestId);
    // this will be used later so yeah
    this.props.canvasRequest(getSingleQuiz, { course_id: examRequest.course_id, id: examRequest.exam_id });
    // this.props.createListener(
    //   'api/canvas',
    //   { course_id: courseId, id: quizId },
    //   () => (false),
    //   () => (false),
    //   quizId,
    //   getSingleQuiz
    // );
  }

  componentDidUpdate(nextProps) {
    if (nextProps.signedUrl !== this.props.signedUrl) {
      window.open(this.props.signedUrl);
    }
  }

  render() {
    const styles = BaseEnterAnswers.getStyles();

    return (
      <div>
        <h1>Enter Answers</h1>
        <div>
          The exam should open in a new window.
          Please enter the proctor code below to begin entering answers.
        </div>
        <div style={styles.proctorCodeBox}>
          { this.props.quiz ? this.props.quiz.access_code : 'Loading...' }
        </div>
        <div>
          <HoverButton onClick={() => hashHistory.push('/')}>Go Back</HoverButton>
        </div>
      </div>
    );
  }
}

export default connect(select, { canvasRequest, createListener, getSignedUrl })(BaseEnterAnswers);
