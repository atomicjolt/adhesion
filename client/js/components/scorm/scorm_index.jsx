"use strict";

import React                    from 'react';
import { connect }              from 'react-redux';
import CoursesList              from './courses_list';
import * as ScormActions        from '../../actions/scorm';

const FileUpload = (props) => {
  const handleChange = (e) => {
    const files = e.target.files;
    const file = files.length == 1 ? files[0] : null;
    if(file){
      props.uploadPackage(file);
    }
  };
  return (
    <form>
      <label htmlFor="upload">Upload:</label>
      <input
        id="upload"
        type="file"
        onChange={(e) => handleChange(e)} />
    </form>
  );
};

const select = (state, props) => {
  return {
    userId: state.settings.userId,
    scormList: state.scorm.scormList,
    shouldRefreshList: state.scorm.shouldRefreshList
  };
};

@connect(select, ScormActions, null, { withRefs: true })
export default class ScormIndex extends React.Component {
  componentDidMount(){
    this.props.loadPackages();
  }

  componentDidUpdate(){
    if(this.props.shouldRefreshList){
      this.props.loadPackages();
    }
  }

  render(){
    return (
      <div>
        <div>
          <h1>SCORM</h1>
          <FileUpload
            uploadPackage={this.props.uploadPackage}/>
        </div>

        <div>
          <CoursesList
            list={this.props.scormList}
            userId={this.props.userId}
            loadLaunchUrl={this.props.loadLaunchUrl}
            removePackage={this.props.removePackage} />
        </div>
      </div>
    );
  }

}
