import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import SvgButton from '../../../common_components/svg_button';
import ImportTypeSelector from './import_type_selector';
import Loader from '../../../common_components/loader';
import AssignmentButton from './assignment_button';

export class Course extends React.Component {
  static ImportTypes = {
    GRADED: 'GRADED',
    UNGRADED: 'UNGRADED',
    NOT_SELECTED: 'NOT_SELECTED',
  };

  static DefaultPointValue = 100;

  static propTypes = {
    course: React.PropTypes.shape({
      id: React.PropTypes.number.isRequired,
      lms_assignment_id: React.PropTypes.number,
      index: React.PropTypes.number,
      is_graded: React.PropTypes.string,
      title: React.PropTypes.string,
      fetching: React.PropTypes.string,
    }).isRequired,
    removePackage: React.PropTypes.func.isRequired,
    importPackage: React.PropTypes.func.isRequired,
    previewPackage: React.PropTypes.func.isRequired,
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

  render() {
    const isAssignment = !_.isUndefined(this.props.course.lms_assignment_id);
    const isGraded = this.props.course.is_graded === Course.ImportTypes.GRADED;
    const assignmentButtonProps = {
      canvasUrl: this.props.canvasUrl,
      courseId: this.props.courseId,
      lms_assignment_id: this.props.course.lms_assignment_id,
    };

    let assignmentButton;
    let dropDown;

    if (this.props.course.fetching) {
      dropDown = <div style={Course.getStyles().loaderContainer}><Loader /></div>;
    } else if (isAssignment && isGraded) {
      assignmentButton = <AssignmentButton {...assignmentButtonProps} />;
      dropDown = <div className="c-list-item__type" style={{ minWidth: '20rem' }}>Graded Assignment</div>;
    } else if (isAssignment && !isGraded) {
      assignmentButton = <AssignmentButton {...assignmentButtonProps} />;
      dropDown = <div className="c-list-item__type" style={{ minWidth: '20rem' }}>Ungraded Assignment</div>;
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

    return (
      <li className="c-list__item c-list__item--choose">
        <div className="c-list-item__main">
          <div className="c-list-item__contain">
            <div className="c-list-item__title">{this.props.course.title}</div>
            {dropDown}
          </div>
          <div className="c-list-item__icons">
            {assignmentButton}
            <SvgButton type="preview" onClick={() => this.handlePreview()} />
            <SvgButton type="delete" onClick={() => this.handleRemove()} />
          </div>
        </div>
      </li>
    );
  }
}

const select = (state, props) => ({
  canvasUrl: state.settings.customCanvasApiDomain,
  courseId: state.settings.lmsCourseId,
  course: props.course,
});

export default connect(select)(Course);
