import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';

import { listAssignments } from 'atomic-canvas/libs/constants/assignments';
import { listCourseSections } from 'atomic-canvas/libs/constants/sections';
import canvasRequest from 'atomic-canvas/libs/action';
import { createStudentInfo } from '../actions/submissions';
import { createSectionInfo, updateSectionMetadata } from '../actions/sections_info';

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

  static secInfo(section) {
    return {
      id: section.id,
      sis_section_id: section.sis_section_id,
      sis_course_id: section.sis_course_id
    };
  }

  constructor() {
    super();
    this.state = {
      selSection: {},
      confirm: false,
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
    this.setState({
      selSection,
      confirm: false,
    });
  }

  confirm(e) {
    e.preventDefault();

    const {
      gradeSection = {},
      gradeColumn = {},
      gradeType = {},
    } = e.target.elements;

    if (this.state.confirm) {
      const sections = [];
      if (gradeSection.value === '-1') {
        sections.push({ id: -1 });
        _.each(this.props.sections, (section) => {
          const shouldSend = this.shouldSend(gradeType, section);
          if (shouldSend) {
            sections.push(PostGradesTool.secInfo(section));
          }
        });
      } else {
        const section = _.find(this.props.sections, sec => (
          parseInt(gradeSection.value, 10) === sec.id
        ));
        const shouldSend = this.shouldSend(gradeType, section);
        if (shouldSend) {
          sections.push(PostGradesTool.secInfo(section));
        }
      }
      const compSecs = _.compact(sections);
      this.props.createStudentInfo(compSecs, gradeColumn.value, gradeType.value);
      this.props.updateSectionMetadata(compSecs, this.props.lmsCourseId, gradeType.value);
      this.closeTool.submit(); // closes Modal
    } else {
      this.setState({ confirm: true });
    }
  }

  shouldSend(gradeType, section) {
    const type = gradeType.value === 'midterm' ? 'mid_posted' : 'final_posted';
    return !this.props.sectionsInfo[section.id][type];
  }

  topText() {
    const finalSubmitted = (
      <div>
        <h2 className="subtitle">You have already submitted final grades:</h2>
        <p className="body-text">
          If you need to change grades you will have to contact the Registrar.
          If you would like a record of the grades you submitted,
          you can export or print your gradebook.
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
          you can export or print your gradebook.
        </p>
      </div>
    );

    return this.state.selSection.final_posted ? finalSubmitted : clarification;
  }

  confirmationText() {
    if (this.state.confirm) {
      return (
        <p className="post-grades__confirmation" role="alert">
          Are you sure you want to post grades?
        </p>
      );
    }
    return null;
  }

  bottomButtons() {
    if (this.state.selSection.final_posted) {
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
        <button type="submit" className="btn btn--blue">
          {this.state.confirm ? 'Post Grades' : 'Confirm'}
        </button>
      </div>
    );
  }

  postedTimes() {
    const {
      any_posted:anyPosted,
      mid_posted:midPosted,
      final_posted:finalPosted,
    } = this.state.selSection;

    if (anyPosted) {
      return (
        <div className="date-posted" id="date-posted">
          {midPosted ? `Midterm posted ${moment(midPosted).calendar()}` : null} <br />
          {finalPosted ? `Final posted ${moment(finalPosted).calendar()}` : null}
        </div>
      );
    }
    return null;
  }

  renderSections() {
    const {
      lms_section_id:lmsSectionId,
    } = this.state.selSection;
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
          <option value={-1}>All Sections</option>
          {
            _.map(this.props.sections, section => (
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
    const {
      mid_posted:midPosted,
      final_posted:finalPosted,
    } = this.state.selSection;

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

  renderAssignments() {
    const {
      final_posted:finalPosted,
    } = this.state.selSection;

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
            _.map(this.props.assignments, assignment => (
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

  close() {
    this.closeTool.submit();
  }

  renderClose(title) {
    return (
      <input type="button" value={title} onClick={() => this.close()} className="btn btn--blue" />
    );
  }

  closeForm() {
    return (
      <form
        ref={(el) => { this.closeTool = el; }}
        action={this.props.launchPesentationReturnUrl}
      />
    );
  }

  render() {
    return (
      <div className="post-grades-modal">
        {this.closeForm()}
        <form role="form" onSubmit={e => this.confirm(e)}>
          {this.topText()}
          {this.renderSections()}
          {this.renderTypes()}
          {this.renderAssignments()}
          {this.bottomButtons()}
        </form>
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
