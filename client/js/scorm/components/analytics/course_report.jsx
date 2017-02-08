import React                 from 'react';
import { connect }           from 'react-redux';
import * as AnalyticsActions from '../../actions/analytics';

export class CourseReport extends React.Component {

  static propTypes = {
    loadCourseData: React.PropTypes.func,
    scormCourseId: React.PropTypes.string,
    title: React.PropTypes.string,
    meanScore: React.PropTypes.number,
  }

  componentDidMount() {
    this.props.loadCourseData(this.props.scormCourseId);
  }

  render() {
    return (
      <div>
        <h1>{this.props.title}</h1>
        <h4>Course - Mean Score: {this.props.meanScore}</h4>
        <h4>Course - Total Registrations: </h4>
        <h4>Course - Median Score: </h4>
        <h4>Course - Lowest Score: </h4>
        <h4>Course - Highest Score: </h4>
      </div>
    );
  }
}

const select = (state, props) => {
  return {
    scormCourseId: props.params.courseId,
    title: state.analytics.title,
    meanScore: state.analytics.meanScore,
  };
};

export default connect(select, AnalyticsActions)(CourseReport);
