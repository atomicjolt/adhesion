import React from 'react';
import CommonSvg from '../../../common_components/common_svg';

export default class FileUpload extends React.Component {

  static propTypes = {
    uploadPackage: React.PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.inputRef = null;
  }

  handleChange(e) {
    const files = e.target.files;
    const file = files.length === 1 ? files[0] : null;
    if (file) {
      this.props.uploadPackage(file);
      this.inputRef.value = '';
    }
  }


  render() {
    const inputStyles = {
      display: 'none',
    };

    return (
      <label className="c-btn-label" htmlFor="upload">
        <div className="c-btn c-btn--upload">
          <CommonSvg className="c-icon-upload" type="upload" />
          <input
            id="upload"
            type="file"
            ref={(node) => { this.inputRef = node; }}
            onChange={e => this.handleChange(e)}
            style={inputStyles}
          />
          <strong> Upload</strong>
        </div>
      </label>
    );
  }
}
