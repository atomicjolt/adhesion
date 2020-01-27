import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as ScormActions from '../../actions/scorm';
import CommonSvg from '../../../../libs/components/common_svg';
import SvgButton from '../../../../libs/components/svg_button';
import Loader from '../../../../libs/components/loader';

const select = state => ({
  scormFile: state.scorm.file,
  error: state.scorm.uploadError,
  errorText: state.scorm.errorText,
  errorHandle: 'removeError',
});

export class Uploader extends React.Component {

  static getStyles() {
    return {
      loaderContainer: {
        position: 'absolute',
        right: '50px',
        top: '0px',
      },
      alignLeft: {
        textAlign: 'left',
        width: '100%',
        fontSize: '1.5em'
      }
    };
  }

  renderError() {
    const errorText = this.props.errorText || 'This file is not a valid SCORM package.';
    return (
      <div>
        <span className="c-upload-error">
          <CommonSvg className="c-icon-error" type="error" />
          <span>{errorText}</span>
        </span>
        <SvgButton onClick={() => this.props.removeError()} type={this.props.errorHandle} />
      </div>
    );
  }

  render() {
    let renderProgress;
    const styles = Uploader.getStyles();
    if (this.props.error) {
      renderProgress = this.renderError();
    } else {
      renderProgress = (
        <div style={styles.alignLeft}>
          Large packages may take several minutes to upload.
          <div style={styles.loaderContainer}>
            <Loader />
          </div>
        </div>
      );
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

Uploader.propTypes = {
  error: PropTypes.bool,
  errorText: PropTypes.string,
  errorHandle: PropTypes.string.isRequired,
  removeError: PropTypes.func.isRequired,
  scormFile: PropTypes.shape({
    name: PropTypes.string,
  }),
};

export default connect(select, ScormActions)(Uploader);
