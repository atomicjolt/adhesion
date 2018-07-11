import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

export default class Sections extends React.PureComponent {
  static propTypes = {
    selSection: PropTypes.object,
    sections: PropTypes.object,
    sectionsLoading: PropTypes.bool,
    setSelected: PropTypes.func,
  }

  static posted(type, date) {
    if (date) {
      return <div>{`${type} posted ${moment(date).calendar()}`}</div>;
    }
    return null;
  }

  setSelected(value) {
    this.props.setSelected(value);
  }

  postedTimes() {
    const {
      any_posted:anyPosted,
      mid_posted:midPosted,
      final_posted:finalPosted,
    } = this.props.selSection;

    if (anyPosted) {
      return (
        <div className="date-posted" id="date-posted">
          {Sections.posted('Midterm', midPosted)}
          {Sections.posted('Final', finalPosted)}
        </div>
      );
    }
    return null;
  }

  sectionsNote() {
    const {
      lms_section_id:lmsSectionId,
    } = this.props.selSection;

    if (lmsSectionId === -1) {
      return (
        <div className="date-posted" id="date-posted">
          Previously posted sections will not be included.
        </div>
      );
    }

    return null;
  }

  render() {
    const {
      sections,
      sectionsLoading,
    } = this.props;

    if (sectionsLoading) {
      return (
        <div className="loading">
          <div className="c-loading-icon" role="img" aria-label="loading" />
        </div>
      );
    }
    const singleSection = _.size(sections) === 1;

    return (
      <div className="input-container">
        <label htmlFor="gradeSection">Section</label>
        <select
          key="gradeSection"
          onChange={e => this.setSelected(e.target.value)}
          name="gradeSection"
          id="gradeSection"
          aria-describedby="date-posted"
        >
          { singleSection ? null : <option value={-1}>All Sections</option> }
          {
            _.map(sections, section => (
              <option
                key={`section_${section.id}`}
                value={section.id}
              >
                {section.name}
              </option>
            ))
          }
        </select>
        { this.postedTimes() }
        { this.sectionsNote() }
      </div>
    );
  }
}
