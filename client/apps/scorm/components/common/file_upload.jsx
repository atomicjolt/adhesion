import React from 'react';
import CommonSvg from '../../../../libs/components/common_svg';

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

  clickInput() {
    this.inputRef.click();
  }

  render() {
    return (
      <div className="upload-container">
        <input
          id="upload"
          type="file"
          ref={(node) => { this.inputRef = node; }}
          onChange={e => this.handleChange(e)}
          className="hidden"
        />
        <label className="c-btn c-btn--upload" htmlFor="upload">
          <CommonSvg className="c-icon-upload" type="upload" />
          <strong> Upload</strong>
        </label>
      </div>
    );
  }
}
