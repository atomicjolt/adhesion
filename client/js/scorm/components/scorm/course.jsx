import React              from 'react';
import _                  from 'lodash';
import Settings           from './settings';
import ImportTypeSelector from './import_type_selector';
import AssignmentButton   from './assignment_button';
import HoverButton        from '../common/hover_button';
import Defines            from '../../../defines';
import Loader             from '../../../common_components/loader';

export default class Course extends React.Component {
  static ImportTypes = {
    GRADED: 'GRADED',
    UNGRADED: 'UNGRADED',
    NOT_SELECTED: 'NOT_SELECTED',
  };

  static DefaultPointValue = 100;

  static propTypes = {
    course: React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      lms_assignment_id: React.PropTypes.number,
      index: React.PropTypes.number,
      is_graded: React.PropTypes.string,
      title: React.PropTypes.string,
      fetching: React.PropTypes.bool,
    }).isRequired,
    removePackage: React.PropTypes.func.isRequired,
    importPackage: React.PropTypes.func.isRequired,
    previewPackage: React.PropTypes.func.isRequired,
    replacePackage: React.PropTypes.func.isRequired,
    updateImportType: React.PropTypes.func.isRequired,
    canvasUrl: React.PropTypes.string.isRequired,
    courseId: React.PropTypes.string.isRequired,
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
    this.props.removePackage(
      this.props.course.lms_assignment_id,
      this.props.course.id,
    );
  }

  handlePreview() {
    this.props.previewPackage(this.props.course.id);
  }

  handleImportType(e) {
    this.props.updateImportType(this.props.course.index, e.target.value);
  }

  handleGoClick() {
    let pointsPossible = 0;
    if (this.props.course.is_graded === Course.ImportTypes.GRADED) {
      pointsPossible = Course.DefaultPointValue;
    }

    this.props.importPackage(
      this.props.course.id,
      this.props.course.title,
      this.props.course.index,
      pointsPossible,
    );
  }

  handleUpdate() {
    this.inputElement.click();
  }

  updatePackage(e) {
    this.props.replacePackage(e.target.files[0], this.props.course.id);
  }

  openSettings() {
    const opened = this.state.opened;
    this.setState({ opened: !opened });
  }

  render() {
    const styles = Course.getStyles();
    const isAssignment = !_.isUndefined(this.props.course.lms_assignment_id);
    const isGraded = this.props.course.is_graded === Course.ImportTypes.GRADED;
    const assignmentButtonProps = {
      canvasUrl: this.props.canvasUrl,
      courseId: this.props.courseId,
      lms_assignment_id: this.props.course.lms_assignment_id,
    };
    const updateInput = (
      <input
        id="upload"
        type="file"
        ref={(input) => { this.inputElement = input; }}
        onChange={e => this.updatePackage(e)}
        style={styles.inputStyle}
      />
    );

    let assignmentButton;
    let dropDown;
    let settings;

    if (this.props.course.fetching) {
      dropDown = <div style={styles.loaderContainer}><Loader /></div>;
    } else if (isAssignment && isGraded) {
      assignmentButton = <AssignmentButton {...assignmentButtonProps} />;
      dropDown = <div className="c-list-item__type" style={styles.dropDown}>Graded Assignment</div>;
    } else if (isAssignment && !isGraded) {
      assignmentButton = <AssignmentButton {...assignmentButtonProps} />;
      dropDown = <div className="c-list-item__type" style={styles.dropDown}>Ungraded Assignment</div>;
    } else {
      const isUnselected = !_.isUndefined(this.props.course.is_graded)
        && this.props.course.is_graded !== Course.ImportTypes.NOT_SELECTED;
      dropDown = (
        <ImportTypeSelector
          isGoBtnActive={isUnselected}
          handleSelectChange={e => this.handleImportType(e)}
          handleGoClick={() => this.handleGoClick()}
        />
      );
    }

    if (this.state.opened) {
      settings = (<Settings
        assignmentButton={assignmentButton}
        handlePreview={() => this.handlePreview()}
        handleUpdate={() => this.handleUpdate()}
        handleRemove={() => this.handleRemove()}
        updateInput={updateInput}
      />);
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
            ><i className="material-icons">settings</i></HoverButton>
          </div>
        </div>
        {settings}
      </li>
    );
  }
}
