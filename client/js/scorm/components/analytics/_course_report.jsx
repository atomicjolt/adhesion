import React                      from 'react';
import { connect }                from 'react-redux';
import Header                     from './header';
import Graph                      from './graph';
import AnalyticList               from './analytic_list';
import * as AnalyticsActions      from '../../actions/analytics';

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
      completed: React.PropTypes.array,
      regDetails: React.PropTypes.shape({
        name: React.PropTypes.string,
        passed: React.PropTypes.string,
        score: React.PropTypes.number,
        time: React.PropTypes.string,
      }),
    }).isRequired,
  }

  static getStyles() {
    return {
      stats: {
        float: 'left',
      },
    };
  }

  constructor() {
    super();
    this.state = {
      activeIndex: null,
    };
  }

  componentWillMount() {
    this.props.loadCourseData(this.props.scormCourseId);
  }

  render() {
    const data = this.props.data || {};

    return (
      <div className="c-aa-contain">
        <Header title = { data.title } />
        <Graph data = { data } />
        <AnalyticList regList={data.regDetails} />
      </div>
    );
  }
}

const select = (state, props) => ({
  scormCourseId: props.params.courseId,
  data: state.analytics.data,
});

export default connect(select, AnalyticsActions)(CourseReport);
