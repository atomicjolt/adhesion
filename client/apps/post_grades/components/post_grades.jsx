import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { listAssignments } from '../../../libs/canvas/constants/assignments';
import canvasRequest from '../../../libs/canvas/action';

const select = state => ({
  lmsCourseId: state.settings.lms_course_id,
  assignments: state.assignments,
});

export class PostGradesTool extends React.Component {
  static propTypes = {
    canvasRequest: PropTypes.func,
    lmsCourseId: PropTypes.string,
    assignments: PropTypes.array,
  };

  constructor() {
    super();
    this.state = {};
  }

  componentWillMount() {
    this.props.canvasRequest(
      listAssignments,
      { course_id: this.props.lmsCourseId },
    );
  }

  renderAssignments() {
    return _.map(this.props.assignments, (assignment) => {
      return <li key={assignment.id}>{assignment.name}</li>;
    });
  }

  render() {
    return (
      <div>
        <h1>Post Grades</h1>
        <ul>{this.renderAssignments()}</ul>
      </div>
    );
  }
}

export default connect(select, { canvasRequest })(PostGradesTool);
