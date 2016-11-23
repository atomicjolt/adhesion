/* eslint class-methods-use-this: ["error", { "exceptMethods": ["getStyles"] }] */

import React                    from 'react';
import { connect }              from 'react-redux';
import * as ScormActions        from '../../actions/scorm';
import CommonSvg                from '../common/common_svg';
import SvgButton                from '../common/svg_button';
import Loader                   from '../../../common_components/loader';

export class Uploader extends React.Component {

  getStyles() {
    return {
      loaderContainer: {
        position: 'absolute',
        right: '50px',
        top: '0px',
      },
    };
  }

  renderError() {
    return (
      <div>
        <span className="c-upload-error">
          <CommonSvg className="c-icon-error" type="error" />
          <span>This file is not a valid SCORM package.</span>
        </span>
        <SvgButton handleClick={() => this.props.removeError()} type={this.props.errorHandle} />
      </div>
    );
  }

  render() {
    let renderProgress;
    if (this.props.error) {
      renderProgress = this.renderError();
    } else {
      renderProgress = <div style={this.getStyles().loaderContainer}><Loader /></div>;
    }

    return (
      <ul className="c-upload">
        <li className="c-list__upload">
          <CommonSvg className="c-icon-upload" type="upload" />
          <div className="c-list-item__title">{this.props.scormFile.name}</div>
          {renderProgress}
        </li>
      </ul>
    );
  }
}

const select = (state) => {
  return {
    scormFile: state.scorm.file,
    error: state.scorm.uploadError,
    errorHandle: 'removeError',
  };
};

Uploader.propTypes = {
  error: React.PropTypes.bool,
  errorHandle: React.PropTypes.string.isRequired,
  removeError: React.PropTypes.func.isRequired,
  scormFile: React.PropTypes.object,
};

export default connect(select, ScormActions)(Uploader);
