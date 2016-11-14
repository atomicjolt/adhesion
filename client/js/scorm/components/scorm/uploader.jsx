"use strict";

import React                    from 'react';
import { connect }              from 'react-redux';
import CoursesList              from './courses_list';
import * as ScormActions        from '../../actions/scorm';
import CommonSvg                from '../common/common_svg';
import SvgButton                from '../common/svg_button';

export class Uploader extends React.Component {

  renderError() {
    if (this.props.error) {
      return (
        <div className="c-upload-error">
          <CommonSvg className="c-icon-error" type="error" />
          <span>This file is not a valid SCORM package.</span>
        </div>
      );
    } else {
      return null;
    }
  }

  renderProgress() {
    if (this.props.error) {
      return (
        <div className="c-progress-bar red">
          <span style={{width: "100%"}}></span>
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

  renderButton() {
    if (this.props.error) {
      return (
        <SvgButton handleClick={(e)=>this.props.removeError()} type="removeError" />
      );
    } else {
      return null;
    }
  }

  render() {
    return (
      <ul className="c-upload">
        <li className="c-list__upload">
          <CommonSvg className="c-icon-upload" type="upload"/>
          <div className="c-list-item__title">{this.props.scormFile.name}</div>
          {this.renderError()}
          {this.renderProgress()}
          {this.renderButton()}
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
