import React from 'react';
import assets from '../../libs/assets';

export default function UploadButton(props) {
  let content = 'Upload Files';
  let submitClass = props.canSubmit ? 'c-submit is-active' : 'c-submit';

  if (props.isConverting) {
    submitClass += ' is-converting';
    content = (
      <img
        src={assets('./images/spinner.svg')}
        alt="loading spinner icon"
      />
    );
  }

  return <button type="submit" className={submitClass}>{content}</button>;
}

UploadButton.propTypes = {
  isConverting: React.PropTypes.bool.isRequired,
  canSubmit: React.PropTypes.bool.isRequired,
};
