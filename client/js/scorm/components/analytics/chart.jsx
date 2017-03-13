import React  from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend }    from 'recharts';

export default function Chart(props) {
  return (
    <PieChart width={400} height={300}>
      <Pie data={props.data} startAngle={90} endAngle={450} label labelLine>
        {
          props.data.map((key, index) =>
            <Cell key={key} fill={props.colors[index % props.colors.length]} />)
        }
      </Pie>
      <Legend layout="vertical" verticalAlign="top" align="right" />
      <Tooltip />
    </PieChart>
  );
}
