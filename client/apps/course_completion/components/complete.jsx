import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import canvasRequest from 'atomic-canvas/libs/action';
import { markCourseAsCompleted } from '../actions/course_completion';

const select = ({ settings }) => ({
  lmsCourseId: settings.lms_course_id
});

export class Complete extends React.Component {
  static propTypes = {
    markCourseAsCompleted: PropTypes.func.isRequired,
    lmsCourseId: PropTypes.string.isRequired,
  }

  styles = {
    container: {
      marginTop: '40px',
      padding: '20px'
    },
    completeButton: {
      fontSize: '3em',
      color: 'white',
      padding: '10px 20px',
      backgroundColor: '#3F51B5',
      border: 'none',
      borderRadius: '2px',
      boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)'
    }
  }

  render() {
    return (
      <div style={this.styles.container}>
        <h2>Mark course as complete</h2>
        <div>This action will mark that you have completed your self paced course.</div>
        <div>Be sure you have finished all your work before pushing the complete button.</div>
        <div>This action cannot be undone.</div>
        <button
          style={this.styles.completeButton}
          onClick={() => this.props.markCourseAsCompleted(this.props.lmsCourseId)}
        >
          Complete
        </button>
      </div>
    );
  }

}

export default connect(select,
  {
    canvasRequest,
    markCourseAsCompleted
  })(Complete);
