import React from 'react';
import NavButton from './nav_button';

export default class NavButtons extends React.Component {

  static propTypes = {
    navButtons: React.PropTypes.array,
    switchChart: React.PropTypes.func,
  }

  constructor() {
    super();
    this.state = {
      activeBtn: 'Complete',
    };
  }

  setActive(label) {
    this.setState({ activeBtn: label });
    this.props.switchChart(label);
  }

  render() {
    const {
      navButtons
    } = this.props;

    return (
      <div>
        {
          navButtons.map(button =>
            <NavButton
              key={`nav_button_${button.name}`}
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
