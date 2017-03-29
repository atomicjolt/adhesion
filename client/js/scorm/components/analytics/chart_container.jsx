import React          from 'react';
import Chart          from './chart';
import Scores         from './scores';
import BarChart from './bar_chart';

const PASSED_COLORS = ['#67a9cf', '#c9c9c9', '#ef8a62'];
const COMPLETED_COLORS = ['#67a9cf', '#ef8a62'];

export default function ChartContainer(props) {
  const {
    data,
  } = props;

  const {
    passFail,
    completed,
    scores,
    courseTimeSpent,
  } = data;

  let chart;

  if (props.selected === 'Passed' && passFail) {
    chart = (
      <Chart
        colors={PASSED_COLORS}
        data={passFail}
      />
    );
  } else if (props.selected === 'Completed' && completed) {
    chart = (
      <Chart
        colors={COMPLETED_COLORS}
        data={completed}
      />
    );
  } else if (props.selected === 'Average Score' && scores) {
    chart = (
      <Scores
        scores={scores}
      />
    );
  } else if (props.selected === 'Minutes Per Learner' && courseTimeSpent) {
    chart = (
      <BarChart
        data={courseTimeSpent}
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
