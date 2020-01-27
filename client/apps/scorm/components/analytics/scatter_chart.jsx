import React from 'react';
import PropTypes from 'prop-types';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const Chart = (props) => {
  const {
    data,
  } = props;

  const margin = {
    top: 40,
    right: 80,
    left: 10,
    bottom: 5,
  };

  // TODO: once available in recharts (should be in 1.0 release),
  // overlay a line of best fit
  return (
    <ScatterChart
      width={400}
      height={300}
      data={data}
      margin={margin}
    >
      <XAxis dataKey="time" label="Time (minutes)" />
      <YAxis dataKey="score" label="Score (scaled)" />
      <Scatter name="Score-time Correlation" data={data} fill="#8884d8" />
      <CartesianGrid />
      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
    </ScatterChart>
  );
};

export default Chart;

Chart.propTypes = {
  data: PropTypes.array,
};
