"use strict";

import React                    from 'react';
import { connect }              from 'react-redux';
import * as ScormActions        from '../../actions/scorm';
import CoursesList              from './courses_list';
import Uploader                 from './uploader';
import { create_assignment, delete_assignment }    from '../../libs/canvas/constants/assignments';
import canvasRequest            from '../../libs/canvas/action';

const FileUpload = (props) => {
  const handleChange = (e) => {
    const files = e.target.files;
    const file = files.length == 1 ? files[0] : null;
    if(file){
      props.uploadPackage(file);
    }
  };

  return (
    <label className="c-btn-label" htmlFor="upload">
      <div className="c-btn c-btn--upload">
        <svg className="c-icon-upload" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
          <path d="M0 0h48v48h-48z" fill="none"/>
          <path className="c-path" d="M38.71 20.07c-1.36-6.88-7.43-12.07-14.71-12.07-5.78 0-10.79 3.28-13.3 8.07-6.01.65-10.7 5.74-10.7 11.93 0 6.63 5.37 12 12 12h26c5.52 0 10-4.48 10-10 0-5.28-4.11-9.56-9.29-9.93zm-10.71 5.93v8h-8v-8h-6l10-10 10 10h-6z"/>
        </svg>
        <input
          id="upload"
          type="file"
          onChange={(e) => handleChange(e)}
          style={{ zIndex: "-1", width: "0.1px", height: "0.1px", opacity: "0", overflow:"hidden", position: "absolute" }}/>
        <strong>Upload</strong>
      </div>
    </label>
  );
};

const select = (state, props) => {
  return {
    lmsCourseId: state.settings.lms_course_id,
    userId: state.settings.userId,
    apiUrl: state.settings.apiUrl,
    scormList: state.scorm.scormList,
    shouldRefreshList: state.scorm.shouldRefreshList,
    scormFile: state.scorm.file,
    uploadError: state.scorm.uploadError
  };
};

@connect(select, {...ScormActions, canvasRequest}, null, { withRefs: true })
export default class ScormIndex extends React.Component {
  constructor(props){
    super(props);
  }

  componentDidMount(){
    this.props.loadPackages();
  }

  componentDidUpdate(){
    if(this.props.shouldRefreshList){
      this.props.loadPackages();
    }
  }

  createAssignment(packageId, assignmentName){
    const query = {
      assignment: {
        name: assignmentName,
        submission_types: ["external_tool"],
        integration_id: `${packageId}`,
        integration_data: {provider: "atomic-scorm"},
        external_tool_tag_attributes: {
          url: `${this.props.apiUrl}scorm_course?course_id=${packageId}`
        }
      }
    };

    this.props.canvasRequest(
      create_assignment,
      {course_id: this.props.lmsCourseId},
      query
    );
  };

  deleteAssignment(assignmentId, packageId){
    this.props.removePackage(packageId);
    if(!assignmentId){return;}
    this.props.canvasRequest(
      delete_assignment,
      {course_id: this.props.lmsCourseId, id:assignmentId}
    );
  }


  render(){
    var uploader = (this.props.scormFile) ? <Uploader /> : null;
    return (
      <div className="o-main-contain">

        <div className="c-header">
          <h1 className="c-header__title">SCORM</h1>
          <div className="c-header__btns" onClick={(e)=>{this.props.removeError()}}>
            <FileUpload
              uploadPackage={this.props.uploadPackage}
            />
          </div>
        </div>

        { uploader }

        <CoursesList
          list={this.props.scormList}
          removePackage={this.deleteAssignment.bind(this)}
          previewPackage={this.props.previewPackage}
          importPackage={
            (packageId, assignmentName) => this.createAssignment(packageId, assignmentName)
          }
        />

      </div>
    );
  }
}
