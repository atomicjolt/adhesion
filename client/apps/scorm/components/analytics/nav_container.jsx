import React from 'react';
import PropTypes from 'prop-types';
import NavButton from './nav_button';

export default class NavButtons extends React.Component {

  static propTypes = {
    navButtons: PropTypes.array,
    switchChart: PropTypes.func,
  }

  constructor() {
    super();
    this.state = {
      activeBtn: 'complete',
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
              type={button.type}
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
