"use strict";

import React                    from 'react';
import { connect }              from 'react-redux';
import CoursesList              from './courses_list';
import * as ScormActions        from '../../actions/scorm';
import CommonSvg                from '../../../common_components/common_svg';
import SvgButton                from '../../../common_components/svg_button';

export class Uploader extends React.Component {

  renderProgress() {
    if (this.props.error) {
      return (
        <div>
          <div className="c-upload-error">
            <CommonSvg className="c-icon-error" type="error" />
            <span>This file is not a valid SCORM package.</span>
          </div>
          <div className="c-progress-bar red">
            <span style={{width: "100%"}}></span>
          </div>
          <SvgButton onClick={(e)=>this.props.removeError()} type="removeError" />
        </div>
      );
    } else {
      return (
        <div className="c-progress-bar">
          <span style={{width: "100%"}}><span className="progress blue"></span></span>
        </div>
      );
    }
  }

  render() {
    return (
      <ul className="c-upload">
        <li className="c-list__upload">
          <CommonSvg className="c-icon-upload" type="upload"/>
          <div className="c-list-item__title">{this.props.scormFile.name}</div>
          {this.renderProgress()}
        </li>
      </ul>
    );
  }
}

const select = (state, props) => {
  return {
    scormFile: state.scorm.file,
    error: state.scorm.uploadError
  };
};

export default connect(select, ScormActions)(Uploader);
