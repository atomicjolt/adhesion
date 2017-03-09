import React                                       from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend }    from 'recharts';

export default class Chart extends React.Component {

  static propTypes = {
    data: React.PropTypes.shape({}),
    selected: React.PropTypes.string.isRequired,
  }

  render() {
    const data = this.props.data;
    let chart;
    let COLORS;

    if (this.props.selected === 'Passed' && data.passed) {
      COLORS = ['#67a9cf', '#c9c9c9', '#ef8a62'];
      chart = (
        <PieChart width={400} height={300}>
          <Pie data={data.passed} startAngle={90} endAngle={450} label labelLine>
            {
              data.passed.map((key, index) =>
                <Cell key={key} fill={COLORS[index % COLORS.length]} />)
            }
          </Pie>
          <Legend layout="vertical" verticalAlign="top" align="right" />
          <Tooltip />
        </PieChart>
      );
    }

    if (this.props.selected === 'Completed' && data.completed) {
      COLORS = ['#67a9cf', '#ef8a62'];
      chart = (
        <PieChart width={400} height={300}>
          <Pie data={data.completed} startAngle={90} endAngle={450} label labelLine>
            {
              data.passed.map((key, index) =>
                <Cell key={key} fill={COLORS[index % COLORS.length]} />)
            }
          </Pie>
          <Legend layout="vertical" verticalAlign="top" align="right" />
          <Tooltip />
        </PieChart>
      );
    }

    if (this.props.selected === 'Average Score' && data.meanScore) {
      chart = (
        <div>
          <div className="c-aa-label">Mean Score: {data.meanScore}</div>
          <div className="c-aa-label">Median Score: {data.medScore}</div>
          <div className="c-aa-label">Lowest Score: {data.lowScore}</div>
          <div className="c-aa-label">Highest Score: {data.highScore}</div>
        </div>
      );
    }

    return (
      <div>
        { chart }
      </div>
    );
  }
}
