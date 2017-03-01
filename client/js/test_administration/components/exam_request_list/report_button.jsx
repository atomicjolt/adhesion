import React from 'react';

export default function ReportButton(props) {

  const buttonStyle = {
    color: 'rgb(170, 170, 170)', // text color
    border: '2px solid rgb(245, 245, 245)',
    backgroundColor: 'rgb(245, 245, 245)',
    padding: '10px 25px 10px 25px',
    fontSize: '1em',
  };

  return (
    <button
      className="c-btn  c-btn--export"
      onClick={() => props.onExport(props.downloadOptions)}
      style={buttonStyle}
    >
      {props.text}
    </button>
  );
}

ReportButton.propTypes = {
  text: React.PropTypes.string,
  onExport: React.PropTypes.func.isRequired,
  downloadOptions: React.PropTypes.shape({}),
};
