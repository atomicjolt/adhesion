import React                               from 'react';
import { connect }                         from 'react-redux';
import { PieChart, Pie, Cell, Tooltip }    from 'recharts';
import * as AnalyticsActions               from '../../actions/analytics';

export class CourseReport extends React.Component {

  static propTypes = {
    loadCourseData: React.PropTypes.func,
    scormCourseId: React.PropTypes.string,
    data: React.PropTypes.shape({
      title: React.PropTypes.string,
      meanScore: React.PropTypes.number,
      regCount: React.PropTypes.number,
      medScore: React.PropTypes.number,
      lowScore: React.PropTypes.number,
      highScore: React.PropTypes.number,
      passed: React.PropTypes.array,
    }),
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
    if (data.passed) {
      const COLORS = ['#4393c3', '#b2182b'];
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
    return (
      <div>
        <h1>{data.title}</h1>
        <div style={CourseReport.getStyles().stats}>
          <h4>Mean Score: {data.meanScore}</h4>
          <h4>Total Registrations: {data.regCount}</h4>
          <h4>Median Score: {data.medScore}</h4>
          <h4>Lowest Score: {data.lowScore}</h4>
          <h4>Highest Score: {data.highScore}</h4>
        </div>
        <div style={CourseReport.getStyles().pieChart}>
          <h4>How many learners are passing this course?</h4>
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
