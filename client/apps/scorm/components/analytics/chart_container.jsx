import React from 'react';
import PropTypes from 'prop-types';
import Chart from './pie_chart';
import ScatterChart from './scatter_chart';
import Scores from './scores';
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
    correlationData,
    courseTimeSpent,
  } = data;

  const styles = {
    scoresContainer: {
      overflow: 'auto',
      position: 'relative',
    },
  };

  let chart;

  if (props.selected === 'passed' && passFail) {
    chart = (
      <Chart
        colors={PASSED_COLORS}
        data={passFail}
      />
    );
  } else if (props.selected === 'complete' && completed) {
    chart = (
      <Chart
        colors={COMPLETED_COLORS}
        data={completed}
      />
    );
  } else if (props.selected === 'average_score' && scores) {
    chart = (
      <div style={styles.scoresContainer}>
        <ScatterChart
          data={correlationData}
        />
        <Scores
          scores={scores}
        />
      </div>
    );
  } else if (props.selected === 'minutes_per_learner' && courseTimeSpent) {
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
  data: PropTypes.shape({}),
  selected: PropTypes.string.isRequired,
};
