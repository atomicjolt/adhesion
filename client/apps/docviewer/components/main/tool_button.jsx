import React from 'react';

export default class ToolButton extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <button className="download-button" type="submit">
          <i className="material-icons icon-white">{this.props.icon}</i>
        </button>
      </div>
    );
  }
}
