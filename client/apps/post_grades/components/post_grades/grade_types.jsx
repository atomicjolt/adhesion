import React from 'react';
import PropTypes from 'prop-types';

export default class GradeTypes extends React.PureComponent {
  static propTypes = {
    selSection: PropTypes.object,
  }

  render() {
    const {
      mid_posted:midPosted,
      final_posted:finalPosted,
    } = this.props.selSection;

    return (
      <fieldset className={`input-container ${finalPosted ? 'is-disabled' : ''}`}>
        <legend>Grade type</legend>
        <div className="radio-container">
          <input
            disabled={midPosted}
            id="midterm"
            type="radio"
            name="gradeType"
            value="midterm"
          />
          <label htmlFor="midterm">
            <div className="radio-label">Midterm</div>
          </label>
        </div>
        <div className="radio-container">
          <input
            disabled={finalPosted}
            id="final-grade"
            type="radio"
            name="gradeType"
            value="final"
          />
          <label htmlFor="final-grade">
            <div className="radio-label">Final Grade</div>
          </label>
        </div>
      </fieldset>
    );
  }
}
