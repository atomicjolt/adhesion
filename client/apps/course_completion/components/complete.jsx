import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import canvasRequest from 'atomic-canvas/libs/action';
import { listEnrollmentsUsers } from 'atomic-canvas/libs/constants/enrollments';
import { markCourseAsCompleted } from '../actions/course_completion';
import Loader from './loader';

const select = ({ settings, complete }) => ({
  lmsCourseId: settings.lms_course_id,
  lmsUserId: settings.lms_user_id,
  enrollments: complete.enrollments,
  processing: complete.processing || false,
  completed: complete.completed || false,
  error: complete.error || undefined,
  result: complete.result || undefined,
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
    msg: '',
  }

  componentWillMount() {
    const filter = { state: ['active', 'completed'] };
    const params = { user_id: this.props.lmsUserId, ...filter };
    this.props.canvasRequest(listEnrollmentsUsers, params, {});
  }

  componentWillUpdate(nextProps) {
    // If Enrollment has just been returned from Canvas API
    if (_.isEmpty(this.props.enrollments) && !_.isEmpty(nextProps.enrollments)) {
      this.state.ready = true;
      const enrollment = _.find(
        nextProps.enrollments,
        i => i.course_id === parseInt(this.props.lmsCourseId, 10)
      );
      if (enrollment.type === 'StudentEnrollment') {
        if (enrollment.enrollment_state === 'active') {
          this.setState({ valid: true });
        } else {
          this.setState({ msg: 'Already Completed' });
        }
      }
      if (enrollment.type !== 'StudentEnrollment') {
        this.setState({ msg: 'Cannot complete non-student enrollment' });
      }
      // Couldn't find an enrollment in the course to end
      if (nextProps.enrollments === [] || enrollment === undefined) {
        this.setState({ msg: 'No enrollment to complete' });
      }
    }
    // Reducer has recieved response from Canvas API to conclude enrollment
    if (!this.props.completed && nextProps.completed) {
      if (nextProps.result && nextProps.result.status === 200) {
        this.setState({ msg: 'Course Completed!', valid: true });
      } else {
        this.setState({
          msg: 'Unable to complete course at this time.\nPlease try again later.'
        });
      }
    }
    // Still in progress of submitting completion to Canvas
    if (!this.props.processing && nextProps.processing) {
      this.setState({ msg: 'Submitting', valid: false });
    }
  }

  render() {
    if (!this.state.ready) {
      return null;
    }
    const button = (
      <button
        id="ajau-button"
        onClick={() => this.props.markCourseAsCompleted(this.props.lmsCourseId)}
      >
        Complete Course
      </button>
    );
    const noButton = (
      <h3 id="ajau-msgBox">{ this.state.msg }</h3>
    );
    const loader = (
      <Loader />
    );
    return (
      <div>
        { this.state.valid && !this.props.completed ? button : noButton }
        { this.props.processing ? loader : null }
      </div>
    );
  }

}

export default connect(select,
  {
    canvasRequest,
    markCourseAsCompleted,
  })(Complete);
