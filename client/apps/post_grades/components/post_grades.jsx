import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { listAssignments } from '../../../libs/canvas/constants/assignments';
import { listCourseSections } from '../../../libs/canvas/constants/sections';
import { createStudentInfo } from '../actions/submissions';
import { createSectionInfo, updateSectionMetadata } from '../actions/sections_info';
import canvasRequest from '../../../libs/canvas/action';

const select = state => ({
  lmsCourseId: state.settings.lms_course_id,
  assignments: state.assignments,
  sections: state.sections,
  sectionsInfo: state.sectionsInfo,
});

export class PostGradesTool extends React.Component {
  static propTypes = {
    canvasRequest: PropTypes.func,
    lmsCourseId: PropTypes.string,
    assignments: PropTypes.array,
  };

  constructor() {
    super();
    this.state = {
      selSection: {},
    };
  }

  componentWillMount() {
    this.props.canvasRequest(
      listAssignments,
      { course_id: this.props.lmsCourseId },
    );
    this.props.canvasRequest(
      listCourseSections,
      { course_id: this.props.lmsCourseId },
    );
  }

  componentDidUpdate(prevProps) {
    if (prevProps.sections !== this.props.sections) {
      const ids = _.map(this.props.sections, sec => (sec.id));
      this.props.createSectionInfo(ids, this.props.lmsCourseId);
    }
  }

  secInfo(s) {
    return {
      id: s.id,
      sis_section_id: s.sis_section_id,
      sis_course_id: s.sis_course_id
    };
  }

  getSectionInfoById(id) {
    if (id === -1) return null;
    return this.props.sectionsInfo[id];
  }

  confirm() {
    let sections = null;
    if (this.sectionSelect.value === 'all') {
      sections = _.map(this.props.sections, section => (
        this.secInfo(section)
      ));
    } else {
      const section = _.find(this.props.sections, sec => (
        parseInt(this.sectionSelect.value) === sec.id
      ));
      sections = [this.secInfo(section)];
    }
    this.props.createStudentInfo(sections, this.columnSelect.value, this.state.type);
    this.props.updateSectionMetadata(sections, this.props.lmsCourseId, this.state.type);
  }

  renderAssignments() {
    return (
      <div className="input-container">
        <label htmlFor="grade-column">Grade book column to submit</label>
        <select ref={(e) => { this.columnSelect = e; }} name="select2" id="grade-column">
          <option value="total">Total</option>
          {
            _.map(this.props.assignments, assignment => (
              <option value={assignment.id}>{assignment.name}</option>
            ))
          }
        </select>
      </div>
    );
  }

  setSelected(e) {
    const selSection = this.getSectionInfoById(e.target.value);
    this.setState({ selSection });
  }

  renderSections() {
    const { anyPosted, midPosted, finalPosted } = this.state.selSection;
    return (
      <div className="input-container">
        <label htmlFor="grade-section">Section</label>
        <select ref={(el) => { this.sectionSelect = el; }} onChange={e => this.setSelected(e)} name="select" id="grade-section" aria-describedby="date-posted">
          <option value="all">All Sections</option>
          {
            _.map(this.props.sections, section => (
              <option value={section.id}>{section.name}</option>
            ))
          }
        </select>
        {
          anyPosted && do {
            <div className="date-posted" id="date-posted">
              {midPosted ? `Midterm posted ${midPosted}` : null}
              {finalPosted ? `Final posted ${finalPosted}` : null}
            </div>;
          }
        }
      </div>
    );
  }

  renderTypes() {
    const { midPosted, finalPosted } = this.state.selSection;
    return (
      <fieldset className={`input-container ${finalPosted ? 'is-disabled' : ''}`}>
        <legend>Grade type</legend>
        <div className="radio-container">
          <input onChange={() => this.setState({ type: 'midterm' })} disabled={midPosted} id="midterm" type="radio" name="grade-type" value="midterm" />
          <label htmlFor="midterm">
            <div className="radio-label">Midterm</div>
          </label>
        </div>
        <div className="radio-container">
          <input onChange={() => this.setState({ type: 'final' })} disabled={finalPosted} id="final-grade" type="radio" name="grade-type" value="final grade" />
          <label htmlFor="final-grade">
            <div className="radio-label">Final Grade</div>
          </label>
        </div>
      </fieldset>
    );
  }

  render() {
    return (
      <div className="post-grades-modal">
        <h2 className="subtitle">Please Note:</h2>
        <p className="body-text">This will submit grades to the school, if you need to change grades afterwards you wil have to contact the Registrar. If you would like a record of the grades you submitted, you can export or print your grade book.</p>
        {this.renderSections()}
        {this.renderTypes()}
        {this.renderAssignments()}
        <div className="post-grades-modal__bottom">
          <p className="post-grades__confirmation" role="alert">Are you sure you want to post grades?</p>
          <button onClick={() => {}} className="btn btn--gray">Cancel</button>
          <button onClick={() => this.confirm()} className="btn btn--blue">Confirm</button>
        </div>
      </div>
    );
  }
}

export default connect(select,
  {
    canvasRequest,
    createStudentInfo,
    createSectionInfo,
    updateSectionMetadata,
  })(PostGradesTool);
