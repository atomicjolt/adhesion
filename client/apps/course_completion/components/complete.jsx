import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import canvasRequest from 'atomic-canvas/libs/action';
import { listEnrollmentsUsers } from 'atomic-canvas/libs/constants/enrollments';
import { markCourseAsCompleted } from '../actions/course_completion';

const select = ({ settings, complete }) => ({
  lmsCourseId: settings.lms_course_id,
  lmsUserId: settings.lms_user_id,
  enrollments: complete.enrollments,
  processing: complete.processing,
  completed: complete.completed,
  error: complete.error || undefined,
  result: complete.result,
});

export class Complete extends React.Component {
  static propTypes = {
    markCourseAsCompleted: PropTypes.func.isRequired,
    lmsCourseId: PropTypes.string.isRequired,
    lmsUserId: PropTypes.string.isRequired,
  }

  state = {
    valid: false,
    ready: false,
    msg: 'Cannot complete your enrollment',
  }

  styles = {
    completeButton: {
      fontSize: '3em',
      color: 'white',
      padding: '10px 20px',
      backgroundColor: '#3F51B5',
      border: 'none',
      borderRadius: '2px',
      boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
      margin: '40px auto',
    },
    messageBox: {
      fontSize: '3em',
      padding: '10px 10px',
      margin: '40px auto',
    }
  }

  componentWillMount() {
    const filter = { state: ['active', 'completed'] };
    const params = { user_id: this.props.lmsUserId, ...filter };
    this.props.canvasRequest(listEnrollmentsUsers, params, {});
  }

  componentWillUpdate(nextProps) {
    // TODO: refactor into fewer cases
    if (_.isEmpty(this.props.enrollments) && !_.isEmpty(nextProps.enrollments)) {
      this.state.ready = true;
      const enrollment = _.find(
        nextProps.enrollments,
        i => i.course_id === parseInt(this.props.lmsCourseId, 10)
      );
      if (enrollment.type === 'StudentEnrollment' && enrollment.enrollment_state === 'active') {
        this.setState({ valid: true });
      }
      if (nextProps.enrollments === [] || enrollment === undefined) {
        this.setState({ msg: 'No enrollment to complete' });
      }
      if (enrollment.enrollment_state === 'completed') {
        this.setState({ msg: 'Course Completed!' });
      }
    }
    if (this.props.processing) {
      this.setState({ msg: 'Processing...' });
    }
    if (this.props.completed && this.props.error !== undefined) {
      this.setState({
        msg: 'Unable to complete course at this time.\nPlease try again later.'
      });
    }
  }

  render() {
    if (!this.state.ready) {
      return null;
    }
    if (this.props.processing) {
      return (
        // TODO: Put Processing Component Here instead
        <h3 style={this.styles.messageBox}>{ this.state.msg }</h3>
      );
    }
    // TODO: Make this button it's own component
    const button = (
      <button
        style={this.styles.completeButton}
        onClick={() => this.props.markCourseAsCompleted(this.props.lmsCourseId)}
      >
        Complete Course
      </button>
    );
    const noButton = (
      <h3 style={this.styles.messageBox}>{ this.state.msg }</h3>
    );
    return (
      <div style={this.styles.container}>
        { this.state.valid && !this.props.completed ? button : noButton }
      </div>
    );
  }

}

export default connect(select,
  {
    canvasRequest,
    markCourseAsCompleted,
  })(Complete);
