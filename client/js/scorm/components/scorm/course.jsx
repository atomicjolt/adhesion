"use strict";

import React                    from 'react';
import { connect }              from 'react-redux';
import SvgButton                from '../common/svg_button';
import ImportTypeSelector       from './import_type_selector';

const AssignmentButton = (props) => {
  return(
    <a href={`https://${props.canvasUrl}/courses/${props.courseId}/assignments/${props.lms_assignment_id}`} target="_parent"><SvgButton type="gradedAssignment"/></a>
  );
}

export class Course extends React.Component {
  static ImportTypes = {
    GRADED: "GRADED",
    UNGRADED: "UNGRADED",
    NOT_SELECTED: "NOT_SELECTED"
  };

  static DefaultPointValue = 100;

  static propTypes = {
    course: React.PropTypes.object.isRequired
  };

  handleRemove(){
    this.props.removePackage(
      this.props.course.lms_assignment_id,
      this.props.course.id
    );
  }

  handlePreview(){
    this.props.previewPackage(this.props.course.id);
  }

  handleImportType(e){
    this.props.updateImportType(this.props.course.index, e.target.value);
  }

  handleGoClick(){
    if(this.props.course.is_graded == Course.ImportTypes.GRADED){
      var pointsPossible = Course.DefaultPointValue;
    } else {
      var pointsPossible = 0;
    }

    this.props.importPackage(
      this.props.course.id,
      this.props.course.title,
      this.props.course.index,
      pointsPossible
    );
  }

  formatGraded(course) {
    if (course.is_graded) {
      let word = _.capitalize(course.is_graded);
      return `${word} assignment`;
    }
  }

  render(){
    const isAssignment = !(this.props.course.lms_assignment_id == undefined);
    const isGraded = this.props.course.is_graded == Course.ImportTypes.GRADED;
    const assignmentButtonProps = {
      canvasUrl: this.props.canvasUrl,
      courseId: this.props.courseId,
      lms_assignment_id: this.props.course.lms_assignment_id
    };

    // TODO put spinner here
    // course should have property this.props.fetching == true -> should render spinner

    var assignmentButton;
    if(isAssignment && isGraded){
      assignmentButton = <AssignmentButton {...assignmentButtonProps} />
      var dropdown = <div className="c-list-item__type" style={{minWidth: "20rem"}}>Graded Assignment</div>;
    } else if(isAssignment && !isGraded) {
      assignmentButton = <AssignmentButton {...assignmentButtonProps} />
      var dropdown = <div className="c-list-item__type" style={{minWidth: "20rem"}}>Ungraded Assignment</div>;
    } else {
      var isNotUnselected = this.props.course.is_graded == undefined || this.props.course.is_graded == Course.ImportTypes.NOT_SELECTED;
      var dropdown = (<ImportTypeSelector
          handleSelectChange = {(e) => this.handleImportType(e)}
          handleGoClick      = {() => this.handleGoClick()}
          isGoBtnActive      = {!isNotUnselected}
        />);
    }

    return (
      <li className="c-list__item c-list__item--choose">
        <div className="c-list-item__main">
          <div className="c-list-item__contain">
            <div className="c-list-item__title">{this.props.course.title}</div>
            {dropdown}
          </div>
          <div className="c-list-item__icons">
            {assignmentButton}
            <SvgButton type="preview" handleClick={() => this.handlePreview()}/>
            <SvgButton type="delete" handleClick={() => this.handleRemove()}/>
          </div>
        </div>
      </li>
    );
  }
}

const select = (state, props) => {
  return {
    canvasUrl: state.settings.customCanvasApiDomain,
    courseId: state.settings.lmsCourseId,
    course: props.course
  };
};

export default connect(select)(Course);
