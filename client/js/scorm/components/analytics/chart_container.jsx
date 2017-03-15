import React          from 'react';
import Chart          from './chart';
import AverageScore   from './average_score';

const PASSED_COLORS = ['#67a9cf', '#c9c9c9', '#ef8a62'];
const COMPLETED_COLORS = ['#67a9cf', '#ef8a62'];

export default function ChartContainer(props) {
  const data = props.data;
  let chart;

  if (props.selected === 'Passed' && data.passed) {
    chart = (
      <Chart
        colors={PASSED_COLORS}
        data={data.passed}
      />
    );
  } else if (props.selected === 'Completed' && data.completed) {
    chart = (
      <Chart
        colors={COMPLETED_COLORS}
        data={data.completed}
      />
    );
  } else if (props.selected === 'Average Score' && data.meanScore) {
    chart = (
      <AverageScore
        data={data}
      />
    );
  }

  return (
    <div>
      {chart}
    </div>
  );
}

ChartContainer.propTypes = {
  data: React.PropTypes.shape({}),
  selected: React.PropTypes.string.isRequired,
};
