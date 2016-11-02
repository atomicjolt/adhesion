"use strict";

import React                    from 'react';
import { connect }              from 'react-redux';

const GradedAssign = (props) => {
  return (
    <button className="c-icon-btn" style={{display: (props.isGradeActive) ? "inline" : "none"}}>
      <svg className="c-icon" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
          <path d="M0 0h48v48h-48z" fill="none"/>
          <path className="c-path" d="M28 4h-16c-2.21 0-3.98 1.79-3.98 4l-.02 32c0 2.21 1.77 4 3.98 4h24.02c2.21 0 4-1.79 4-4v-24l-12-12zm4 32h-16v-4h16v4zm0-8h-16v-4h16v4zm-6-10v-11l11 11h-11z"/>
      </svg>
    </button>
  );
};

const DeleteButton = (props) => {
  return (
    <button className="c-icon-btn" onClick={(e) => props.handleClick(e)}>
      <svg className="c-icon" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
        <path className="c-path" d="M12 38c0 2.21 1.79 4 4 4h16c2.21 0 4-1.79 4-4v-24h-24v24zm26-30h-7l-2-2h-10l-2 2h-7v4h28v-4z"/>
        <path d="M0 0h48v48h-48z" fill="none"/>
      </svg>
    </button>
  );
};

const PreviewButton = (props) => {
  return (
    <button className="c-icon-btn" onClick={(e) => props.handleClick(e)}>
      <svg className="c-icon" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
        <path className="c-path" d="M24 9C14 9 5.46 15.22 2 24c3.46 8.78 12 15 22 15s18.54-6.22 22-15C42.54 15.22 34.01 9 24 9zm0 25c-5.52 0-10-4.48-10-10s4.48-10 10-10 10 4.48 10 10-4.48 10-10 10zm0-16c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"/>
        <path d="M0 0h48v48h-48z" fill="none"/>
      </svg>
  </button>
  );
};

export default class Course extends React.Component {
  constructor(props){
    super(props);

    this.state = { isShowDesc: false, isGoBtnActive: "inactive", selectVal: "0", isGradeActive: false};
    this.handleDesc = this.handleDesc.bind(this);
    this.handleImportType = this.handleImportType.bind(this);
    this.handleGoClick = this.handleGoClick.bind(this);
  }

  static propTypes = {
    course: React.PropTypes.object.isRequired
  };

  handleLaunch(){
    this.props.loadLaunchUrl(this.props.course.id, this.props.studentId);
  }

  handleGraded(){
    const courseId = this.props.course.id;
    // this.props.removePackage(courseId);
  }

  handleRemove(){
    const courseId = this.props.course.id;
    this.props.removePackage(courseId);
  }

  handlePreview(){
    this.props.previewPackage(this.props.course.id);
  }

  handleDesc(){
    this.setState({isShowDesc: (this.state.isShowDesc) ? false : true});
  }

  handleImport(){
    this.props.importPackage(
      this.props.course.id,
      this.props.course.title
    );
  }

  handleImportType(event){
    var isGoBtnActive = "inactive";

    if(event.target.value != 0){
      isGoBtnActive = "active";
    }

    this.setState({ isGoBtnActive, selectVal: event.target.value });
  }

  handleGoClick(){
    // TODO: need to have an action that sets the import type for the course.
    (this.state.isGoBtnActive == "active") ? this.setState({isGradeActive: true}) : null;
  }

  render(){
    const dropdownSection = (!this.state.isGradeActive) ? <div className="c-list-item__type">
                                                            <div className="c-dropdown">
                                                              <select onChange={this.handleImportType}>
                                                                <option value="0">Choose import type...</option>
                                                                <option value="Graded Assignment">Import as graded assignment</option>
                                                                <option value="Ungraded Assignment">Import as ungraded assignment</option>
                                                              </select>
                                                              <svg className="c-icon-drop" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
                                                                <path className="c-path" d="M14 20l10 10 10-10z"/>
                                                                <path d="M0 0h48v48h-48z" fill="none"/>
                                                              </svg>
                                                            </div>
                                                            <button className={"c-btn c-btn--go is-" + this.state.isGoBtnActive} onClick={ (e)=>{this.handleGoClick() }}>Go</button>
                                                          </div>
                                                        : <div className="c-list-item__type" style={{minWidth: "20rem"}}>{this.state.selectVal}</div>;

    return (
      <li className="c-list__item c-list__item--choose">
        <div className="c-list-item__main">
          <svg className="c-icon-arrow" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" onClick={(e)=>{ e.preventDefault(); this.handleDesc(); }}>
            <path className="c-path" d="M14 20l10 10 10-10z"/>
            <path d="M0 0h48v48h-48z" fill="none"/>
          </svg>
          <div className="c-list-item__click" onClick={(e)=>{ e.preventDefault(); this.handleDesc(); }}></div>
          <div className="c-list-item__contain">
            <div className="c-list-item__title">{this.props.course.title}</div>
            { dropdownSection }
          </div>
          <div className="c-list-item__icons">
            <GradedAssign handleClick={() => this.handleGraded()} isGradeActive={this.state.isGradeActive}/>
            <PreviewButton handleClick={() => this.handlePreview()}/>
            <DeleteButton handleClick={() => this.handleRemove()}/>
          </div>
        </div>
      </li>
    );
  }
}
