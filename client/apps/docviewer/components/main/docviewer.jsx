import React from 'react';
import { connect } from 'react-redux';

const select = () => ({
});

export class Docviewer extends React.Component {
  render() {
    return (
      <div>
        <h1>Docviewer</h1>
      </div>
    );
  }
}

export default connect(select)(Docviewer);
