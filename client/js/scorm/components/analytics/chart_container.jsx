import React          from 'react';
import Chart          from './chart';
import AverageScore   from './average_score';

export default class ChartContainer extends React.Component {

  static propTypes = {
    data: React.PropTypes.shape({}),
    selected: React.PropTypes.string.isRequired,
  }

  render() {
    const data = this.props.data;
    let chart;
    let colors;

    if(this.props.selected === 'Passed' && data.passed) {
      colors = ['#67a9cf', '#c9c9c9', '#ef8a62'];
      chart = (
        <Chart
          colors = { colors }
          data = { data.passed } />
      )
    } else if (this.props.selected === 'Completed' && data.completed) {
      colors = ['#67a9cf', '#ef8a62'];
      chart = (
        <Chart
          colors = { colors }
          data = { data.completed } />
      )
    } else if (this.props.selected === 'Average Score' && data.meanScore) {
      chart = (
        <AverageScore
          data= { data } />
      )
    }

    return (
      <div>
        { chart }
      </div>
    );
  }
}
