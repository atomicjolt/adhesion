import React          from 'react';
import Chart          from './chart';
import AverageScore   from './average_score';

const PASSED_COLORS = ['#67a9cf', '#c9c9c9', '#ef8a62'];
const COMPLETED_COLORS = ['#67a9cf', '#ef8a62'];

export default function ChartContainer(props) {
  const {
    data,
  } = props;

  const {
    passFail,
    completed,
    meanScore,
    medScore,
    lowScore,
    highScore,
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
  } else if (props.selected === 'Average Score' && meanScore) {
    chart = (
      <AverageScore
        meanScore={meanScore}
        medScore={medScore}
        lowScore={lowScore}
        highScore={highScore}
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
