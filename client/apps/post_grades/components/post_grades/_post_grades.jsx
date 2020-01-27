import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { listAssignmentsAssignments } from 'atomic-canvas/libs/constants/assignments';
import { listCourseSections } from 'atomic-canvas/libs/constants/sections';
import canvasRequest from 'atomic-canvas/libs/action';
import { createStudentInfo } from '../../actions/submissions';
import { createSectionInfo, updateSectionMetadata } from '../../actions/sections_info';

import Assignments from './assignments';
import Sections from './sections';
import GradeTypes from './grade_types';

const select = state => ({
  lmsCourseId: state.settings.lms_course_id,
  launchPesentationReturnUrl: state.settings.launch_presentation_return_url,
  assignments: state.assignments.data,
  assignmentsLoading: state.assignments.loading,
  sections: state.sections.data,
  sectionsLoading: state.sections.loading,
  sectionsInfo: state.sectionsInfo,
  submissions: state.submissions,
});

export class PostGradesTool extends React.Component {
  static propTypes = {
    canvasRequest: PropTypes.func,
    lmsCourseId: PropTypes.string,
    sections: PropTypes.object,
    assignments: PropTypes.array,
    submissions: PropTypes.object,
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
      sections: [],
      gradeType: '',
      confirm: false,
    };
  }

  componentWillMount() {
    this.props.canvasRequest(
      listAssignmentsAssignments,
      { course_id: this.props.lmsCourseId, get_all: true },
    );
    this.props.canvasRequest(
      listCourseSections,
      { course_id: this.props.lmsCourseId, get_all: true },
    );
  }

  componentDidUpdate(prevProps) {
    if (prevProps.sections !== this.props.sections) {
      const ids = _.map(this.props.sections, sec => (sec.id));
      this.props.createSectionInfo(ids, this.props.lmsCourseId);
    }
    if (prevProps.submissions !== this.props.submissions) {
      if (this.props.submissions.studentInfoSubmitted) {
        this.props.updateSectionMetadata(
          this.state.sections,
          this.props.lmsCourseId,
          this.state.gradeType,
        );
      }
    }
    if (prevProps.sectionsInfo !== this.props.sectionsInfo) {
      if (this.props.sectionsInfo.sectionMetadataSubmitted) {
        this.closeTool.submit(); // closes Modal
      } else {
        this.setSelected(-1);
      }
    }
  }

  setSelected(value) {
    const selSection = this.props.sectionsInfo.data[value];
    this.setState({
      selSection,
      sections: [],
      gradeType: '',
      confirm: false,
    });
  }

  confirm(e) {
    e.preventDefault();

    const {
      gradeSection = {},
      gradeColumn = {},
    } = e.target.elements;

    // Edge browser returns an HtmlCollection instead of the checked radio.
    // So we have to manually get the checked value.
    const gradeType = e.target.querySelector('input[name="gradeType"]:checked');

    if (this.state.confirm) {
      let sections = [];
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
      sections = _.compact(sections);
      this.setState({
        sections,
        gradeType: gradeType.value,
      });
      this.props.createStudentInfo(sections, gradeColumn.value, gradeType.value);
    } else {
      this.setState({ confirm: true });
    }
  }

  shouldSend(gradeType, section) {
    const type = gradeType.value === 'midterm' ? 'mid_posted' : 'final_posted';
    return !this.props.sectionsInfo.data[section.id][type];
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

    const {
      gradeType,
    } = this.state;

    const disabled = !gradeType;

    let buttonClasses = 'btn btn--blue';
    if (disabled) {
      buttonClasses = `${buttonClasses} is-disabled`;
    }

    return (
      <div className="post-grades-modal__bottom">
        { this.confirmationText() }
        {this.gradeTypeErrors()}
        {this.renderClose('Cancel')}
        <button type="submit" className={buttonClasses} disabled={disabled}>
          {this.state.confirm ? 'Post Grades' : 'Confirm'}
        </button>
      </div>
    );
  }

  gradeTypeErrors() {
    if (this.props.submissions.showError) {
      return <div style={{ color: 'red' }}>{this.props.submissions.showError.response.body.exception}</div>;
    }
    if (this.props.sectionsInfo.showError) {
      return <div style={{ color: 'red' }}>{this.props.sectionsInfo.showError.response.body.exception}</div>;
    }
    return null;
  }

  close() {
    if (this.state.confirm) {
      this.setState({ confirm: false });
    } else {
      this.closeTool.submit();
    }
  }

  closeForm() {
    return (
      <form
        ref={(el) => { this.closeTool = el; }}
        action={this.props.launchPesentationReturnUrl}
      />
    );
  }

  renderClose(title) {
    return (
      <input type="button" value={title} onClick={() => this.close()} className="btn btn--blue" />
    );
  }

  setGradeType(gradeType) {
    this.setState({ gradeType });
  }

  render() {
    return (
      <div className="post-grades-modal">
        {this.closeForm()}
        <form onSubmit={e => this.confirm(e)}>
          {this.topText()}
          <Sections
            selSection={this.state.selSection}
            sections={this.props.sections}
            sectionsLoading={this.props.sectionsLoading}
            setSelected={e => this.setSelected(e)}
          />
          <GradeTypes
            selSection={this.state.selSection}
            selectGradeType={gradeType => this.setGradeType(gradeType)}
            gradeType={this.state.gradeType}
          />
          <Assignments
            selSection={this.state.selSection}
            assignments={this.props.assignments}
            assignmentsLoading={this.props.assignmentsLoading}
          />
          {this.bottomButtons()}
        </form>
      </div>
    );
  }
}

export default connect(
  select,
  {
    canvasRequest,
    createStudentInfo,
    createSectionInfo,
    updateSectionMetadata,
  }
)(PostGradesTool);
