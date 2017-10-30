import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { listAssignments } from 'atomic-canvas/libs/constants/assignments';
import { listCourseSections } from 'atomic-canvas/libs/constants/sections';
import { createStudentInfo } from '../actions/submissions';
import { createSectionInfo, updateSectionMetadata } from '../actions/sections_info';
import canvasRequest from 'atomic-canvas/libs/action';

const select = state => ({
  lmsCourseId: state.settings.lms_course_id,
  launchPesentationReturnUrl: state.settings.launch_presentation_return_url,
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
      type: null,
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
    if (prevProps.sectionsInfo !== this.props.sectionsInfo) {
      this.setSelected(-1);
    }
  }

  setSelected(value) {
    const selSection = this.props.sectionsInfo[value];
    this.setState({ selSection });
  }

  secInfo(s) {
    return {
      id: s.id,
      sis_section_id: s.sis_section_id,
      sis_course_id: s.sis_course_id
    };
  }

  confirm() {
    if (this.state.confirmed) {
      let sections = null;
      if (this.sectionSelect.value === '-1') {
        sections = [{ id: -1 }];
        _.each(this.props.sections, (section) => {
          const type = this.state.type === 'midterm' ? 'midPosted' : 'finalPosted';
          const shouldSend = this.props.sectionsInfo[section.id][type];
          if (!shouldSend) {
            sections.push(this.secInfo(section));
          }
        });
      } else {
        const section = _.find(this.props.sections, sec => (
          parseInt(this.sectionSelect.value, 10) === sec.id
        ));
        sections = [this.secInfo(section)];
      }
      const compSecs = _.compact(sections);
      this.props.createStudentInfo(compSecs, this.columnSelect.value, this.state.type);
      this.props.updateSectionMetadata(compSecs, this.props.lmsCourseId, this.state.type);
      this.form.submit(); // closes Modal
    } else {
      this.setState({ confirmed: true });
    }
  }

  topText() {
    const finalSubmitted = (
      <div>
        <h2 className="subtitle">You have already submitted final grades:</h2>
        <p className="body-text">
          If you need to change grades you will have to contact the Registrar.
          If you would like a record of the grades you submitted,
          you can export or print your grade book.
        </p>
      </div>
    );
    const clarification = (
      <div>
        <h2 className="subtitle">Please Note:</h2>
        <p className="body-text">
          This will submit grades to the school,
          if you need to change grades afterwards you will have to contact the Registrar.
          If you would like a record of the grades you submitted,
          you can export or print your grade book.
        </p>
      </div>
    );

    return this.state.selSection.finalPosted ? finalSubmitted : clarification;
  }

  confirmationText() {
    if (this.state.confirmed) {
      return (
        <p className="post-grades__confirmation" role="alert">
          Are you sure you want to post grades?
        </p>
      );
    }
    return null;
  }

  bottomButtons() {
    if (this.state.selSection.finalPosted) {
      return (
        <div className="post-grades-modal__bottom">
          {this.renderClose('Close')}
        </div>
      );
    }

    return (
      <div className="post-grades-modal__bottom">
        { this.confirmationText() }
        {this.renderClose('Cancel')}
        <button disabled={!this.state.type} onClick={() => this.confirm()} className="btn btn--blue">
          {this.state.confirmed ? 'Post Grades' : 'Confirm'}
        </button>
      </div>
    );
  }

  postedTimes(anyPosted, midPosted, finalPosted) {
    if (anyPosted) {
      return (
        <div className="date-posted" id="date-posted">
          {midPosted ? `Midterm posted ${midPosted.split('T')[0]}` : null} <br />
          {finalPosted ? `Final posted ${finalPosted.split('T')[0]}` : null}
        </div>
      );
    }
    return null;
  }

  renderSections() {
    const { anyPosted, midPosted, finalPosted, lmsSectionId } = this.state.selSection;
    return (
      <div className="input-container">
        <label htmlFor="grade-section">Section</label>
        <select
          ref={(el) => { this.sectionSelect = el; }}
          onChange={e => this.setSelected(e.target.value)}
          name="select"
          id="grade-section"
          aria-describedby="date-posted"
        >
          <option value={-1}>All Sections</option>
          {
            _.map(this.props.sections, section => (
              <option value={section.id}>{section.name}</option>
            ))
          }
        </select>
        { this.postedTimes(anyPosted, midPosted, finalPosted) }
        {
          lmsSectionId === -1 ?
            <div className="date-posted" id="date-posted">
                Previously posted sections will not be included.
            </div> : null
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
          <input
            onChange={() => this.setState({ type: 'midterm' })}
            disabled={midPosted}
            id="midterm"
            type="radio"
            name="grade-type"
            value="midterm"
          />
          <label htmlFor="midterm">
            <div className="radio-label">Midterm</div>
          </label>
        </div>
        <div className="radio-container">
          <input
            onChange={
              () => this.setState({ type: 'final' })
            }
            disabled={finalPosted}
            id="final-grade"
            type="radio"
            name="grade-type"
            value="final grade"
          />
          <label htmlFor="final-grade">
            <div className="radio-label">Final Grade</div>
          </label>
        </div>
      </fieldset>
    );
  }

  renderAssignments() {
    const { finalPosted } = this.state.selSection;
    return (
      <div className={`input-container ${finalPosted ? 'is-disabled' : ''}`}>
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

  renderClose(title) {
    return (
      <form ref={(el) => { this.form = el; }} action={this.props.launchPesentationReturnUrl}>
        <input type="submit" value={title} className="btn btn--blue" />
      </form>
    );
  }

  render() {
    return (
      <div className="post-grades-modal">
        {this.topText()}
        {this.renderSections()}
        {this.renderTypes()}
        {this.renderAssignments()}
        {this.bottomButtons()}
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
