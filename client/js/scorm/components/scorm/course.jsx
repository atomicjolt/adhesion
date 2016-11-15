"use strict";

import React                    from 'react';
import { connect }              from 'react-redux';
import SvgButton                from '../common/svg_button';
import ImportTypeSelector       from './import_type_selector';

export class Course extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      isGoBtnActive: false,
      selectVal: 0,
      isGradeActive: false
    };
  }

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
    this.setState({ isGoBtnActive: e.target.value != 0, selectVal: e.target.value });
  }

  handleGoClick(){
    // TODO: need to have an action that sets the import type for the course.
    if(this.state.isGoBtnActive){
      const params = this.props.importPackage(
        this.props.course.id,
        this.props.course.title
      );
      this.setState({isGradeActive: true});
    }
  }

  formatGraded(course) {
    if (course.is_graded) {
      let word = _.capitalize(course.is_graded);
      return `${word} assignment`;
    }
  }

  render(){
    let dropdownSection;
    let gradedAssignmentButton;
    if(this.state.isGradeActive || !this.props.course.is_graded){
      dropdownSection = (
        <ImportTypeSelector
          handleSelectChange = {(e) => this.handleImportType(e)}
          handleGoClick      = {() => this.handleGoClick()}
          isGoBtnActive      = {this.state.isGoBtnActive}
        />
      );
    } else {
      gradedAssignmentButton = <a href={`https://${this.props.canvasUrl}/courses/${this.props.courseId}/assignments/${this.props.course.lms_assignment_id}`} target="_parent"><SvgButton type="gradedAssignment"/></a>;
      dropdownSection = <div className="c-list-item__type" style={{minWidth: "20rem"}}>{this.formatGraded(this.props.course)}</div>;
    }

    return (
      <li className="c-list__item c-list__item--choose">
        <div className="c-list-item__main">
          <div className="c-list-item__contain">
            <div className="c-list-item__title">{this.props.course.title}</div>
            { dropdownSection }
          </div>
          <div className="c-list-item__icons">
            {gradedAssignmentButton}
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
