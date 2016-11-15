"use strict";

import React                    from 'react';
import { connect }              from 'react-redux';
import SvgButton                from '../common/svg_button';
import ImportTypeSelector       from './import_type_selector';

export default class Course extends React.Component {
  static ImportTypes = {
    GRADED: "GRADED",
    UNGRADED: "UNGRADED",
    NOT_SELECTED: "NOT_SELECTED"
  };

  static DefaultPointValue = 100;

  static propTypes = {
    course: React.PropTypes.object.isRequired
  };

  handleGraded(){
    const courseId = this.props.course.id;
  }

  handleRemove(){
    // TODO figure out why canvas api request is failing
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

    const params = this.props.importPackage(
      this.props.course.id,
      this.props.course.title,
      pointsPossible
    );
  }

  render(){
    const isAssignment = !(this.props.course.lms_assignment_id == undefined);
    const isGraded = this.props.course.is_graded == Course.ImportTypes.GRADED;
    if(isAssignment && isGraded){
      var dropdown = <div className="c-list-item__type" style={{minWidth: "20rem"}}>Graded Assignment</div>;
    } else if(isAssignment && !isGraded) {
      var dropdown = <div className="c-list-item__type" style={{minWidth: "20rem"}}>Ungraded Assignment</div>;
    } else {
      var dropdown = (<ImportTypeSelector
          handleSelectChange = {(e) => this.handleImportType(e)}
          handleGoClick      = {() => this.handleGoClick()}
          isGoBtnActive      = {!this.props.course.is_graded == Course.ImportTypes.NOT_SELECTED}
        />);
    }

    return (
      <li className="c-list__item c-list__item--choose">
        <div className="c-list-item__main">
          <div className="c-list-item__contain">
            <div className="c-list-item__title">{this.props.course.title}</div>
            { dropdown }
          </div>
          <div className="c-list-item__icons">
            <SvgButton type="preview" handleClick={() => this.handlePreview()}/>
            <SvgButton type="delete" handleClick={() => this.handleRemove()}/>
          </div>
        </div>
      </li>
    );
  }
}
