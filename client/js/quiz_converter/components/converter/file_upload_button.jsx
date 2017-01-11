import React from 'react';

export default function FileUploadButton(props) {
  function selectFile(e) {
    let files = e.target.files;
    files = files.length === 1 ? files[0] : null;
    if (files) {
      props.selectFile(files);
    }
  }

  return (
    <div>
      <input
        onChange={selectFile}
        type="file"
        name={props.htmlId}
        id={props.htmlId}
        className="c-upload"
      />
      <label htmlFor={props.htmlId} className={`c-${props.htmlId}-label`}>
        <span>{props.text}</span>
      </label>
    </div>
  );
}

FileUploadButton.propTypes = {
  selectFile: React.PropTypes.func.isRequired,
  text: React.PropTypes.string.isRequired,
  htmlId: React.PropTypes.string.isRequired,
};
