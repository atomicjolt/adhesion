import React, {
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';
import { connect } from 'react-redux';
import canvasRequest from 'atomic-canvas/libs/action';
import { listEnrollmentsUsers } from 'atomic-canvas/libs/constants/enrollments';
import { markCourseAsCompleted } from '../actions/course_completion';
import Loader from './loader';

const select = ({ settings, complete }) => ({
  lmsCourseId: settings.lms_course_id,
  lmsUserId: settings.lms_user_id,
  enrollments: complete.enrollments,
  enrollmentsLoading: complete.enrollmentsLoading,
  processing: complete.processing || false,
  completed: complete.completed || false,
  error: complete.error || undefined,
  result: complete.result || undefined,
});

export const Complete = (props) => {
  const [valid, setValid] = useState(false);
  const [msg, setMsg] = useState('');

  const {
    lmsUserId,
    lmsCourseId,
    completed,
    processing,
    result,
    enrollments,
    enrollmentsLoading,
  } = props;

  useEffect(() => {
    if (enrollmentsLoading) {
      return;
    }

    if (!enrollments) {
      const filter = { state: ['active', 'completed'] };
      const params = { user_id: lmsUserId, ...filter };
      props.canvasRequest(listEnrollmentsUsers, params, {});
    }

    // Still in progress of submitting completion to Canvas
    if (processing) {
      setMsg('Submitting');
      setValid(false);
      return;
    }

    // Reducer has recieved response from Canvas API to conclude enrollment
    if (completed) {
      if (result && result.status === 200) {
        setMsg('Course Completed!');
        setValid(true);
      } else {
        setMsg(
          `Unable to complete course at this time.
          Please try again later.`
        );
      }
      return;
    }

    if (enrollments) {
      const enrollment = _.find(
        enrollments,
        (i) => i.course_id === parseInt(lmsCourseId, 10)
      );

      // Couldn't find an enrollment in the course to end
      if (enrollments === [] || enrollment === undefined) {
        setMsg('No enrollment to complete');
        return;
      }

      if (enrollment.type === 'StudentEnrollment') {
        if (enrollment.enrollment_state === 'active') {
          setValid(true);
        } else {
          setMsg('Already Completed');
        }
        return;
      }

      if (enrollment.type !== 'StudentEnrollment') {
        setMsg('Cannot complete non-student enrollment');
      }
    }
  });

  const button = (
    <button
      id="ajau-button"
      type="button"
      onClick={() => props.markCourseAsCompleted(props.lmsCourseId)}
    >
      Complete Course
    </button>
  );
  const noButton = (
    <h3 id="ajau-msgBox">{ msg }</h3>
  );
  const loader = (
    <Loader />
  );
  if (enrollmentsLoading) {
    return <div>{loader}</div>;
  }
  return (
    <div>
      { valid && !completed ? button : noButton }
      { processing ? loader : null }
    </div>
  );

};

Complete.propTypes = {
  markCourseAsCompleted: PropTypes.func.isRequired,
  lmsCourseId: PropTypes.string.isRequired,
  lmsUserId: PropTypes.string.isRequired,
  enrollmentsLoading: PropTypes.bool,
  completed: PropTypes.bool,
  processing: PropTypes.bool,
  result: PropTypes.object,
  enrollments: PropTypes.array,
};

export default connect(select,
  {
    canvasRequest,
    markCourseAsCompleted,
  })(Complete);
