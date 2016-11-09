"use strict";

import React                    from 'react';
import { connect }              from 'react-redux';
import SvgButton                from '../common/svg_button';
import ImportTypeSelector       from './import_type_selector';

export default class Course extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      isGoBtnActive: false,
      selectVal: "0",
      isGradeActive: false
    };
  }

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

  render(){
    let dropdownSection;
    let gradedAssignmentButton;
    if(!this.state.isGradeActive){
      dropdownSection = (
        <ImportTypeSelector
          handleSelectChange = {(e) => this.handleImportType(e)}
          handleGoClick      = {() => this.handleGoClick()}
          isGoBtnActive      = {this.state.isGoBtnActive}
        />
      );
    } else {
      gradedAssignmentButton = <SvgButton type="gradedAssignment" handleClick={() => this.handleGraded()}/>;
      dropdownSection = <div className="c-list-item__type" style={{minWidth: "20rem"}}>{this.state.selectVal}</div>;
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
