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
    let passedStat = 0;
    let completedStat = 0;
    const averageScore = data.medScore * 100 || 0;
    if (data.passed) {
      passedStat = ((data.passed[0].value / data.regCount) * 100) || 0;
    }
    if (data.completed) {
      completedStat = ((data.completed[0].value / data.regCount) * 100) || 0;
    }

    return (
      <div>
        <NavButton
          label="Completed"
          stat={`${completedStat}%`}
          setActive={label => this.setActive(label)}
          activeBtn={this.state.activeBtn}
        />
        <NavButton
          label="Passed"
          stat={`${passedStat}%`}
          setActive={label => this.setActive(label)}
          activeBtn={this.state.activeBtn}
        />
        <NavButton
          label="Average Score"
          stat={`${averageScore}%`}
          setActive={label => this.setActive(label)}
          activeBtn={this.state.activeBtn}
        />
        <NavButton
          label="Minutes Per Learner"
          stat={100}
          setActive={label => this.setActive(label)}
          activeBtn={this.state.activeBtn}
        />
      </div>
    );
  }
}
