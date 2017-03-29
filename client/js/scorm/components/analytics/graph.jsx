import React              from 'react';
import ChartContainer     from './chart_container';
import NavContainer       from './nav_container';

export default class Graph extends React.Component {

  static propTypes = {
    data: React.PropTypes.shape({}),
    navButtons: React.PropTypes.array,
  }

  constructor() {
    super();
    this.state = {
      selectedChart: 'Complete',
    };
  }

  render() {
    return (
      <div className="c-aa-graph-picker">
        <div className="c-aa-graph-nav">
          <NavContainer
            navButtons={this.props.navButtons}
            switchChart={label => this.setState({ selectedChart: label })}
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
