import React from 'react';
import NavButton from './nav_button';

export default class NavButtons extends React.Component {

  static propTypes = {
    data: React.PropTypes.shape({}),
    switchChart: React.PropTypes.func,
  }

  constructor() {
    super();
    this.state = {
      activeBtn: 'Completed',
    };
  }

  setActive(label) {
    this.setState({ activeBtn: label });
    this.props.switchChart(label);
  }

  render() {
    const data = this.props.data;
    let passedStat;
    let completedStat;
    if (data.passed) {
      passedStat = (data.passed[0].value / data.regCount) * 100
    }
    if (data.completed) {
      completedStat = (data.completed[0].value / data.regCount) * 100;
    }

    return (
      <div>
        <NavButton
          label = 'Completed'
          stat = { completedStat }
          setActive = { this.setActive.bind(this) }
          activeBtn = { this.state.activeBtn } />
        <NavButton
          label = 'Passed'
          stat = { passedStat }
          setActive = { this.setActive.bind(this) }
          activeBtn = { this.state.activeBtn } />
        <NavButton
          label = 'Average Score'
          stat = { data.medScore * 100 }
          setActive = { this.setActive.bind(this) }
          activeBtn = { this.state.activeBtn } />
        <NavButton
          label= 'Minutes Per Learner'
          stat = { 100 }
          setActive = { this.setActive.bind(this) }
          activeBtn = { this.state.activeBtn } />
      </div>
    );
  }
}
