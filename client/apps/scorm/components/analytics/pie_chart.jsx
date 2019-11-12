import React from 'react';
import PropTypes from 'prop-types';
import {
  PieChart, Pie, Cell, Tooltip, Legend
} from 'recharts';

const Chart = (props) => {
  const pieFilling = props.data.map((key, index) => (
    <Cell key={key} fill={props.colors[index % props.colors.length]} />)
  );
  return (
    <PieChart width={400} height={300}>
      <Pie
        data={props.data}
        dataKey="value"
        startAngle={90}
        endAngle={450}
        label
        labelLine
      >
        {pieFilling}
      </Pie>
      <Legend layout="vertical" verticalAlign="top" align="right" />
      <Tooltip />
    </PieChart>
  );
};

export default Chart;

Chart.propTypes = {
  data: PropTypes.array,
  colors: PropTypes.arrayOf(PropTypes.string),
};
