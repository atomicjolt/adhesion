import React        from 'react';
import { connect }  from 'react-redux';

const select = state => ({
  state,
});

export class SurveyTool extends React.Component {
  static propTypes = {
    state: React.PropTypes.node,
  };

  constructor() {
    super();
    this.state = {};
  }

  render() {
    const { state } = this.props;
    // this is just so hound shuts up till we have designs
    if (!state) { return null; }

    return (
      <div>
        <h1>Survey Tool</h1>
      </div>
    );
  }
}

export default connect(select, {})(SurveyTool);
