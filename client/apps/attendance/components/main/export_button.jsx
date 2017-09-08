import React from 'react';

export default function ExportButton(props) {
  return (
    <button
      className="c-btn  c-btn--export"
      role="radio"
      aria-checked="false"
      aria-setsize="2"
      aria-posinset={props.ariaPosinset}
      onClick={() => props.onExport(props.downloadOptions)}
    >
      {props.text}
    </button>
  );
}

ExportButton.propTypes = {
  text: React.PropTypes.string,
  onExport: React.PropTypes.func.isRequired,
  downloadOptions: React.PropTypes.shape({}),
  ariaPosinset: React.PropTypes.number.isRequired,
};
