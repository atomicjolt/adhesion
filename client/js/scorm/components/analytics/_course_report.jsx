import React                      from 'react';
import { connect }                from 'react-redux';
import Header                     from './header';
import Graph                      from './graph';
import AnalyticList               from './analytic_list';
import * as AnalyticsActions      from '../../actions/analytics';

export class CourseReport extends React.Component {

  static propTypes = {
    loadCourseData: React.PropTypes.func.isRequired,
    getUserData: React.PropTypes.func.isRequired,
    scormCourseId: React.PropTypes.string.isRequired,
    data: React.PropTypes.shape({
      title: React.PropTypes.string,
      scores: React.PropTypes.array,
      passed: React.PropTypes.array,
      completed: React.PropTypes.array,
      navButtons: React.PropTypes.array,
      analyticsTable: React.PropTypes.array,
    }).isRequired,
    view: React.PropTypes.string.isRequired,
  }

  constructor() {
    super();
    this.state = {
      currentView: 'activity',
    };
  }

  componentWillMount() {
    if(this.props.view == 'activity') {
      this.props.loadCourseData(this.props.scormCourseId);
    } else if(this.props.view == 'student') {
      this.props.getUserData(this.props.scormCourseId, this.props.viewId);
    }
    this.setState({ currentView: this.props.view });
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.view != this.state.currentView){
      if(nextProps.view == 'activity') {
        nextProps.loadCourseData(nextProps.scormCourseId);
      } else if(nextProps.view == 'student') {
        nextProps.getUserData(nextProps.scormCourseId, nextProps.viewId);
      }
      this.setState({ currentView: nextProps.view });
    }
  }

  render() {
    const data = this.props.data || {};

    return (
      <div className="c-aa-contain">
        <Header
          title={data.title}
          view={this.props.view} />
        <Graph
          data={data}
          view={this.props.view}
          navButtons={data.navButtons} />
        <AnalyticList
          regList={data.analyticsTable}
          view={this.props.view} />
      </div>
    );
  }
}

const select = (state, props) => ({
  scormCourseId: props.params.courseId,
  data: state.analytics.data,
  view: state.analytics.view,
  viewId: state.analytics.viewId,
});

export default connect(select, AnalyticsActions)(CourseReport);
