"use strict";

import React                                    from 'react';
import { connect }                              from 'react-redux';
import * as ScormActions                        from '../../actions/scorm';
import CoursesList                              from './courses_list';
import Uploader                                 from './uploader';
import { create_assignment, delete_assignment } from '../../../libs/canvas/constants/assignments';
import canvasRequest                            from '../../../libs/canvas/action';
import FileUpload                               from '../common/file_upload';

export class ScormIndex extends React.Component {

  componentDidMount(){
    this.props.loadPackages();
  }

  componentDidUpdate(){
    if(this.props.shouldRefreshList){
      this.props.loadPackages();
    }
  }

  createAssignment(packageId, assignmentName, points_possible = 0){
    const query = {
      assignment: {
        name: assignmentName,
        submission_types: ["external_tool"],
        integration_id: `${packageId}`,
        integration_data: {provider: "atomic-scorm"},
        external_tool_tag_attributes: {
          url: `${this.props.apiUrl}scorm_course?course_id=${packageId}`
        },
        points_possible
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
    const uploader = this.props.scormFile ? <Uploader /> : null;
    return (
      <div className="o-main-contain">

        <div className="c-header">
          <h1 className="c-header__title">SCORM</h1>
          <div className="c-header__btns" onClick={(e)=>this.props.removeError()}>
            <FileUpload
              uploadPackage={this.props.uploadPackage}
            />
          </div>
        </div>

        { uploader }

        <CoursesList
          list={this.props.scormList}
          removePackage={(...args) => this.deleteAssignment(...args)}
          previewPackage={this.props.previewPackage}
          importPackage={(...args) => this.createAssignment(...args)}
          updateImportType={this.props.updateImportType}
        />

      </div>
    );
  }
}

const select = (state) => {
  return {
    lmsCourseId: state.settings.lmsCourseId,
    userId: state.settings.userId,
    apiUrl: state.settings.apiUrl,
    scormList: state.scorm.scormList,
    shouldRefreshList: state.scorm.shouldRefreshList,
    scormFile: state.scorm.file,
    uploadError: state.scorm.uploadError
  };
};

export default connect(select, {...ScormActions, canvasRequest})(ScormIndex);
