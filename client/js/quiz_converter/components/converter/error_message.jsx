import React          from 'react';

export default function ErrorMessage(props) {
  if (props.error) {
    return (
      <div className="c-error">
        <span>Error: {props.error}</span>
      </div>
    );
  }

  return null;
}

ErrorMessage.propTypes = {
  error: React.PropTypes.string
};
