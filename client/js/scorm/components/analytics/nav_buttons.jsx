import React from 'react';

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

  renderButton(label, stat) {
    if (this.state.activeBtn === label) {
      return (
        <button className="c-aa-graph-nav__item is-active">
          <span className="c-aa-stat">
            {stat}%
          </span>
          <span className="c-aa-label">{label}</span>
        </button>
      );
    }
    return (
      <button
        className="c-aa-graph-nav__item"
        onClick={() => this.setActive(label)}
      >
        <span className="c-aa-stat">
          {stat}%
        </span>
        <span className="c-aa-label">{label}</span>
      </button>
    );
  }

  render() {
    const data = this.props.data;
    let passedPercentage;
    let completedPercentage;

    if (data.passed) {
      passedPercentage = (data.passed[0].value / data.regCount) * 100;
    }
    if (data.completed) {
      completedPercentage = (data.completed[0].value / data.regCount) * 100;
    }

    return (
      <div>
        {this.renderButton('Completed', completedPercentage)}
        {this.renderButton('Passed', passedPercentage)}
        {this.renderButton('Average Score', ((data.medScore * 100) || 'N/A'))}
        {this.renderButton('Minutes Per Learner', 100)}
      </div>
    );
  }
}

// <button className="c-aa-graph-nav__item">
//   <span className="c-aa-stat">
//     {completedPercentage}%
//   </span>
//   <span className="c-aa-label">Complete</span>
// </button>
// <button className="c-aa-graph-nav__item">
//   <span className="c-aa-stat">
//     {passedPercentage}%
//   </span>
//   <span className="c-aa-label">Passed</span>
// </button>
// <button className="c-aa-graph-nav__item">
//   <span className="c-aa-stat">
//     {(data.medScore * 100) || 'N/A'}%
//   </span>
//   <span className="c-aa-label">Average Score</span>
// </button>
// <button className="c-aa-graph-nav__item">
//   <span className="c-aa-icon">
//     <i className="material-icons">schedule</i>
//   </span>
//   <span className="c-aa-stat">100%</span>
//   <span className="c-aa-label">Minutes per Learner</span>
// </button>
