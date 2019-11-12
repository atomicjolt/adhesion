import React              from 'react';
import PropTypes from 'prop-types';
import _                  from 'lodash';
import Settings           from './settings';
import ImportTypeSelector from './import_type_selector';
import AssignmentButton   from './assignment_button';
import HoverButton        from '../common/hover_button';
import appHistory         from '../../history';
import Defines            from '../../../../libs/defines';
import Loader             from '../../../../libs/components/loader';

export default class Course extends React.Component {
  static ImportTypes = {
    GRADED: 'GRADED',
    UNGRADED: 'UNGRADED',
    PASS_FAIL: 'pass_fail',
    NOT_SELECTED: 'NOT_SELECTED',
  };

  static GradingTypes = {
    PASS_FAIL: 'pass_fail',
    PERCENT: 'percent',
    LETTER_GRADE: 'letter_grade',
    GPA_SCALE: 'gpa_scale',
    POINTS: 'points',
  };

  static DefaultPointValue = 100;

  static propTypes = {
    course: PropTypes.shape({
      id: PropTypes.string.isRequired,
      lms_assignment_id: PropTypes.number,
      index: PropTypes.number,
      grading_type: PropTypes.string,
      title: PropTypes.string,
      fetching: PropTypes.bool,
    }).isRequired,
    removePackage: PropTypes.func.isRequired,
    importPackage: PropTypes.func.isRequired,
    previewPackage: PropTypes.func.isRequired,
    replacePackage: PropTypes.func.isRequired,
    updateImportType: PropTypes.func.isRequired,
    canvasUrl: PropTypes.string.isRequired,
    courseId: PropTypes.string.isRequired,
    hideModal: PropTypes.func.isRequired,
    showModal: PropTypes.func.isRequired,
    canvasAssignment: PropTypes.shape({}),
    publishPackage: PropTypes.func.isRequired,
  };

  static getStyles() {
    return {
      loaderContainer: {
        position: 'absolute',
        left: 'calc(50% - 1.25em)',
        top: '-150%',
      },
      dropDown: {
        minWidth: '20rem',
      },
      button: {
        float: 'right',
        color: Defines.darkGrey,
        backgroundColor: Defines.lightBackground,
        border: 'none',
        cursor: 'pointer',
        fontSize: '1.8em',
        marginRight: '1rem',
      },
      settingsContainer: {
        top: '25%',
        right: '20px',
      },
      hoveredStyle: {
        color: Defines.tanishBrown,
      },
      inputStyle: {
        display: 'none',
      },
    };
  }

  constructor() {
    super();
    this.state = {
      opened: false,
    };
  }

  handleRemove() {
    this.setState({ opened: false });
    this.props.removePackage(
      this.props.course.lms_assignment_id,
      this.props.course.id,
    );
  }

  handlePreview() {
    this.setState({ opened: false });
    this.props.previewPackage(this.props.course.id);
  }

  handleImportType(e) {
    this.props.updateImportType(this.props.course.index, e.target.value);
  }

  handleAnalytics() {
    appHistory.push(`analytics/${this.props.course.id}`);
  }

  handleGoClick() {
    let pointsPossible = 0;
    if (this.props.course.grading_type === Course.ImportTypes.GRADED) {
      pointsPossible = Course.DefaultPointValue;
    }

    let gradingType = Course.GradingTypes.POINTS;
    if (this.props.course.grading_type === Course.GradingTypes.PASS_FAIL) {
      gradingType = Course.GradingTypes.PASS_FAIL;
      pointsPossible = Course.DefaultPointValue;
    }

    this.props.importPackage(
      this.props.course.id,
      this.props.course.title,
      this.props.course.index,
      gradingType,
      pointsPossible,
    );
  }

  handleUpdate() {
    this.inputElement.click();
  }

  updatePackage(e) {
    this.setState({ opened: false });
    this.props.replacePackage(
      e.target.files[0],
      this.props.course.id,
      this.props.courseId,
      this.props.course.index,
    );
  }

  openSettings() {
    const opened = this.state.opened;
    this.setState({ opened: !opened });
  }

  publishAssignment() {
    const publishedState = !this.props.canvasAssignment.published;
    this.props.publishPackage(this.props.course.lms_assignment_id, publishedState);
  }

  render() {
    const styles = Course.getStyles();
    const isAssignment = !_.isUndefined(this.props.course.lms_assignment_id);
    const {
      grading_type:gradingType,
      points_possible:pointsPossible,
    } = this.props.course;
    const assignmentButtonProps = {
      canvasUrl: this.props.canvasUrl,
      courseId: this.props.courseId,
      lms_assignment_id: this.props.course.lms_assignment_id,
    };
    const updateInput = (
      <input
        type="file"
        ref={(input) => { this.inputElement = input; }}
        onChange={e => this.updatePackage(e)}
        style={styles.inputStyle}
      />
    );

    let assignmentButton = null;
    let analyticsButton = false;
    let dropDown = null;
    let settings = null;

    if (this.props.course.fetching) {
      dropDown = <div style={styles.loaderContainer}><Loader /></div>;
    } else if (isAssignment && gradingType === 'points') {
      if (pointsPossible > 0) {
        assignmentButton = <AssignmentButton {...assignmentButtonProps} />;
        analyticsButton = true;
        dropDown = <div className="c-list-item__type" style={styles.dropDown}>Graded Assignment</div>;
      } else {
        assignmentButton = <AssignmentButton {...assignmentButtonProps} />;
        analyticsButton = true;
        dropDown = <div className="c-list-item__type" style={styles.dropDown}>Ungraded Assignment</div>;
      }
    } else if (isAssignment && gradingType === 'pass_fail') {
      assignmentButton = <AssignmentButton {...assignmentButtonProps} />;
      analyticsButton = true;
      dropDown = <div className="c-list-item__type" style={styles.dropDown}>Pass/Fail Assignment</div>;
    } else {
      const isUnselected = !_.isUndefined(this.props.course.grading_type)
        && this.props.course.grading_type !== Course.ImportTypes.NOT_SELECTED;
      dropDown = (
        <ImportTypeSelector
          isGoBtnActive={isUnselected}
          handleSelectChange={e => this.handleImportType(e)}
          handleGoClick={() => this.handleGoClick()}
        />
      );
    }

    if (this.state.opened) {
      settings = (
        <Settings
          assignmentButton={assignmentButton}
          analyticsButton={analyticsButton}
          handlePreview={() => this.handlePreview()}
          handleAnalytics={() => this.handleAnalytics()}
          handleUpdate={() => this.handleUpdate()}
          handleRemove={() => this.handleRemove()}
          updateInput={updateInput}
          showModal={this.props.showModal}
          hideModal={this.props.hideModal}
        />
      );
    }

    let isAssignmentButton = null;

    if (isAssignment) {
      let cloudIcon = <i className="material-icons">cloud_off</i>;

      if (this.props.canvasAssignment.published) {
        cloudIcon = <i className="material-icons" style={{ color: '#51B548' }}>cloud_done</i>;
      }

      isAssignmentButton = (
        <HoverButton
          style={styles.button}
          onClick={() => this.publishAssignment()}
          hoveredStyle={styles.hoveredStyle}
        >
          { cloudIcon }
        </HoverButton>
      );
    }

    return (
      <li className="c-list__item c-list__item--choose">
        <div className="c-list-item__main">
          <div className="c-list-item__contain">
            <div className="c-list-item__title">{this.props.course.title}</div>
            {dropDown}
          </div>
          <div className="c-list-item__icons" style={styles.settingsContainer}>
            <HoverButton
              style={styles.button}
              onClick={() => this.openSettings()}
              hoveredStyle={styles.hoveredStyle}
            >
              <i className="material-icons">settings</i>
            </HoverButton>
            { isAssignmentButton }
          </div>
        </div>
        {settings}
      </li>
    );
  }
}
