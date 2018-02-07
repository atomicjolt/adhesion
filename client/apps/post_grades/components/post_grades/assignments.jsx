import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

export default class Assignments extends React.PureComponent {
  static propTypes = {
    selSection: PropTypes.object,
    assignments: PropTypes.array,
    assignmentsLoading: PropTypes.bool,
  }

  render() {
    const {
      final_posted:finalPosted,
    } = this.props.selSection;

    const {
      assignments,
      assignmentsLoading,
    } = this.props;

    if (assignmentsLoading) {
      return <div>Loading...</div>;
    }

    return (
      <div className={`input-container ${finalPosted ? 'is-disabled' : ''}`}>
        <label htmlFor="gradeColumn">Gradebook column to submit</label>
        <select
          key="gradeColumn"
          name="gradeColumn"
          id="gradeColumn"
          aria-describedby="Gradebook column"
        >
          <option value="total">Total</option>
          {
            _.map(assignments, assignment => (
              <option
                key={`assignment_${assignment.id}`}
                value={assignment.id}
              >
                {assignment.name}
              </option>
            ))
          }
        </select>
      </div>
    );
  }
}
