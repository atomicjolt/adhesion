import React                      from 'react';
import { connect }                from 'react-redux';
import Header                     from './header';
import Graph                      from './graph';
import AnalyticList               from './analytic_list';
import * as AnalyticsActions      from '../../actions/analytics';

export class CourseReport extends React.Component {

  static propTypes = {
    loadCourseData: React.PropTypes.func.isRequired,
    loadUserData: React.PropTypes.func.isRequired,
    loadActivityData: React.PropTypes.func.isRequired,
    scormCourseId: React.PropTypes.string.isRequired,
    data: React.PropTypes.shape({
      studentName: React.PropTypes.string,
      title: React.PropTypes.string,
      scores: React.PropTypes.array,
      passed: React.PropTypes.array,
      completed: React.PropTypes.array,
      navButtons: React.PropTypes.array,
      analyticsTable: React.PropTypes.array,
    }).isRequired,
    view: React.PropTypes.string.isRequired,
    viewId: React.PropTypes.string,
  }

  constructor() {
    super();
    this.state = {
      currentView: 'course',
    };
  }

  componentWillMount() {
    this.setView(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.view !== this.state.currentView) {
      this.setView(nextProps);
    }
  }

  setView(props){
    if (props.view === 'course') {
      props.loadCourseData(props.scormCourseId);
    } else if (props.view === 'student') {
      props.loadUserData(props.scormCourseId, props.viewId);
    } else if (props.view === 'activities') {
      props.loadActivityData(props.scormCourseId, props.viewId);
    }
    this.setState({ currentView: props.view });
  }

  render() {
    const data = this.props.data || {};
    const navButtons = this.props.data.navButtons || [];
    var graph;
    if(this.state.currentView !== 'activities'){
      graph = <Graph
                data={data}
                view={this.props.view}
                navButtons={navButtons}
              />
    }

    return (
      <div className="c-aa-contain">
        <Header
          title={data.title}
          view={this.props.view}
          studentName={data.studentName}
        />
        { graph }
        <AnalyticList
          tableData={data.analyticsTable}
          view={this.props.view}
        />
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
