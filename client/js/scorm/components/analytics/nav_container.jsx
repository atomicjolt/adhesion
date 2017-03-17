import React from 'react';
import _ from 'lodash';
import NavButton from './nav_button';

export default class NavButtons extends React.Component {

  static propTypes = {
    navButtons: React.PropTypes.array,
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
    const {
      data
    } = this.props;
    let passedStat = 0;
    let completedStat = 0;
    const averageScore = data.medScore * 100 || 0;
    if (data.passFail) {
      const passed = _.find(data.passFail, key => key.name === 'Passed');
      passedStat = ((passed.value / data.regCount) * 100) || 0;
    }
    if (data.completed) {
      const completed = _.find(data.completed, key => key.name === 'Completed');
      completedStat = ((completed.value / data.regCount) * 100) || 0;
    }

    return (
      <div>
        {
          this.props.navButtons.map((button, index) =>
            <NavButton
              label={button.name}
              stat={button.stat}
              setActive={label => this.setActive(label)}
              activeBtn={this.state.activeBtn}
            />
          )
        }
      </div>
    );
  }
}
