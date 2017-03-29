import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Chart = (props) => {
  const {
    data,
  } = props;

  return (
    <BarChart
      width={600}
      height={300}
      data={data}
      margin={{top: 5, right: 30, left: 20, bottom: 5}}
    >
      <XAxis dataKey="name" label="Hours"/>
      <YAxis />
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip />
      <Legend />
      <Bar dataKey="students" fill="#8884d8" />
    </BarChart>
  );
};

export default Chart;

Chart.propTypes = {
  data: React.PropTypes.array,
};
