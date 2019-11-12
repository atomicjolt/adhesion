import React from 'react';
import PropTypes from 'prop-types';
import ChartContainer from './chart_container';
import NavContainer from './nav_container';

export default class Graph extends React.Component {

  static propTypes = {
    data: PropTypes.shape({}),
    navButtons: PropTypes.array,
  }

  constructor() {
    super();
    this.state = {
      selectedChart: 'complete',
    };
  }

  render() {
    return (
      <div className="c-aa-graph-picker">
        <div className="c-aa-graph-nav">
          <NavContainer
            navButtons={this.props.navButtons}
            switchChart={type => this.setState({ selectedChart: type })}
          />
        </div>
        <div className="c-aa-graph-container">
          <ChartContainer
            data={this.props.data}
            selected={this.state.selectedChart}
          />
        </div>
      </div>
    );
  }
}
