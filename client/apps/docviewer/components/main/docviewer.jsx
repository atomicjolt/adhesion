import React from 'react';
import { connect } from 'react-redux';

const select = () => ({
});

export class Docviewer extends React.Component {
  constructor() {
    super();
  }

  render() {
    const showTests = false;
    return (
      <div>
        <input
          type="file"
          onChange={this.handleFileInput}
        />
        <div id="viewer">
        </div>
      </div>
    );
  }
}

export default connect(select)(Docviewer);
