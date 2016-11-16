"use strict";

import React                    from 'react';
import { connect }              from 'react-redux';
import SvgButton                from '../common/svg_button';
import ImportTypeSelector       from './import_type_selector';
import Loader                   from '../../../common_components/loader.jsx';

const AssignmentButton = (props) => {
  return(
    <a href={`https://${props.canvasUrl}/courses/${props.courseId}/assignments/${props.lms_assignment_id}`} target="_parent"><SvgButton type="gradedAssignment"/></a>
  );
};

export class Course extends React.Component {
  static ImportTypes = {
    GRADED: "GRADED",
    UNGRADED: "UNGRADED",
    NOT_SELECTED: "NOT_SELECTED"
  };

  static DefaultPointValue = 100;

  static propTypes = {
    course: React.PropTypes.object.isRequired,
    removePackage: React.PropTypes.func.isRequired,
    importPackage: React.PropTypes.func.isRequired,
    previewPackage: React.PropTypes.func.isRequired
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
    let pointsPossible = 0;
    if(this.props.course.is_graded == Course.ImportTypes.GRADED){
      pointsPossible = Course.DefaultPointValue;
    }

    this.props.importPackage(
      this.props.course.id,
      this.props.course.title,
      this.props.course.index,
      pointsPossible
    );
  }

  getStyles(){
    return {
      loaderContainer: {
        position: 'absolute',
        left: 'calc(50% - 1.25em)',
        top: '-150%'
      }
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

    let assignmentButton, dropDown;
    if(this.props.course.fetching){
      dropDown = <div style={this.getStyles().loaderContainer}><Loader/></div>;
    } else if(isAssignment && isGraded){
      assignmentButton = <AssignmentButton {...assignmentButtonProps} />;
      dropDown = <div className="c-list-item__type" style={{minWidth: "20rem"}}>Graded Assignment</div>;
    } else if(isAssignment && !isGraded) {
      assignmentButton = <AssignmentButton {...assignmentButtonProps} />;
      dropDown = <div className="c-list-item__type" style={{minWidth: "20rem"}}>Ungraded Assignment</div>;
    } else {
      const isUnselected = this.props.course.is_graded != undefined && this.props.course.is_graded != Course.ImportTypes.NOT_SELECTED;
      dropDown = (<ImportTypeSelector
          handleSelectChange = {(e) => this.handleImportType(e)}
          handleGoClick      = {() => this.handleGoClick()}
          isGoBtnActive      = {isUnselected}
        />);
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
