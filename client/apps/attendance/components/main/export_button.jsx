import React from 'react';
import PropTypes from 'prop-types';

export default class ExportButton extends React.Component {

  componentDidMount() {
    this.props.text === 'Export All' ? this.eButton.focus() : null;
  }

  render() {
    const { ariaPosinset, onExport, downloadOptions, text } = this.props;
    return (
      <button
        className="c-btn  c-btn--export"
        role="radio"
        aria-checked="false"
        aria-setsize="2"
        aria-posinset={ariaPosinset}
        onClick={() => onExport(downloadOptions)}
        ref={(ref) => { this.eButton = ref; }}
      >
        {text}
      </button>
    );
  }
}

ExportButton.propTypes = {
  text: PropTypes.string,
  onExport: PropTypes.func.isRequired,
  downloadOptions: PropTypes.shape({}),
  ariaPosinset: PropTypes.number.isRequired,
};
