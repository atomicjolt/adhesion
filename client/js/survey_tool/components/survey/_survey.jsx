import React        from 'react';
import { connect }  from 'react-redux';

const select = state => ({
  state,
});

export class SurveyTool extends React.Component {
  static propTypes = {
    state: React.propTypes.node,
  };

  constructor() {
    super();
    this.state = {};
  }

  render() {
    const { state } = this.props;
    if (!state) { console.log('this is just so hound shuts up till we have designs'); }

    return (
      <div>
        <h1>Survey Tool</h1>
      </div>
    );
  }
}

export default connect(select, {})(SurveyTool);
