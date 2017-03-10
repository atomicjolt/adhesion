import React                               from 'react';
import { connect }                         from 'react-redux';
import { PieChart, Pie, Cell, Tooltip }    from 'recharts';
import * as AnalyticsActions               from '../../actions/analytics';

export class CourseReport extends React.Component {

  static propTypes = {
    loadCourseData: React.PropTypes.func.isRequired,
    scormCourseId: React.PropTypes.string.isRequired,
    data: React.PropTypes.shape({
      title: React.PropTypes.string,
      meanScore: React.PropTypes.number,
      regCount: React.PropTypes.number,
      medScore: React.PropTypes.number,
      lowScore: React.PropTypes.number,
      highScore: React.PropTypes.number,
      passed: React.PropTypes.array,
    }).isRequired,
  }

  static getStyles() {
    return {
      stats: {
        float: 'left',
      },
      pieChart: {
        float: 'right',
        paddingRight: '75px',
      },
    };
  }

  componentDidMount() {
    this.props.loadCourseData(this.props.scormCourseId);
  }

  render() {
    const data = this.props.data || {};
    let pieChart;
    let scoreData;

    if (data.passed) {
      const COLORS = ['#67a9cf', '#c9c9c9', '#ef8a62'];
      pieChart = (
        <PieChart width={300} height={300}>
          <Pie data={data.passed} startAngle={90} endAngle={450} label labelLine>
            {
              data.passed.map((key, index) =>
                <Cell key={key} fill={COLORS[index % COLORS.length]} />)
            }
          </Pie>
          <Tooltip />
        </PieChart>
      );
    }

    if (data.meanScore) {
      scoreData = (<div>
        <p>Mean Score: {data.meanScore}</p>
        <p>Median Score: {data.medScore}</p>
        <p>Lowest Score: {data.lowScore}</p>
        <p>Highest Score: {data.highScore}</p>
      </div>);
    } else {
      scoreData = <p>Score data not available.</p>;
    }
    return (
      <div>
        <h1>{data.title}</h1>
        <div style={CourseReport.getStyles().stats}>
          <h3>Total Registrations: {data.regCount}</h3>
          {scoreData}
        </div>
        <div style={CourseReport.getStyles().pieChart}>
          <h3>How many learners are passing this course?</h3>
          {pieChart}
        </div>
      </div>
    );
  }
}

const select = (state, props) => {
  return {
    scormCourseId: props.params.courseId,
    data: state.analytics.data,
  };
};

export default connect(select, AnalyticsActions)(CourseReport);
