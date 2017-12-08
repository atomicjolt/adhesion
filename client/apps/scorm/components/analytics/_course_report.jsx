import React from 'react';
import { connect } from 'react-redux';
import Header from './header';
import Graph from './graph';
import AnalyticList from './analytic_list';
import * as AnalyticsActions from '../../actions/analytics';

export class CourseReport extends React.Component {

  static propTypes = {
    data: React.PropTypes.shape({
      studentName: React.PropTypes.string,
      title: React.PropTypes.string,
      navButtons: React.PropTypes.array,
      analyticsTable: React.PropTypes.array,
    }).isRequired,
    view: React.PropTypes.string.isRequired,
  }

  constructor() {
    super();
    this.state = {
      currentView: 'course',
    };
    this.tableRef = this.tableRef.bind(this);
  }

  componentWillMount() {
    this.setView(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.view !== this.state.currentView) {
      this.setView(nextProps);
    }
  }

  setView(props) {
    if (props.view === 'course') {
      props.loadCourseData(props.scormCourseId);
    } else if (props.view === 'activities') {
      props.loadActivityData(props.scormCourseId, props.viewId);
    }
    this.setState({ currentView: props.view });
  }

  tableRef(el) {
    this.analyticTable = el;
  }

  render() {
    const data = this.props.data || {};

    const navButtons = data.navButtons || [];
    let graph;
    if (this.state.currentView !== 'activities') {
      graph = (<Graph
        data={data}
        view={this.props.view}
        navButtons={navButtons}
      />);
    }

    return (
      <div className="c-aa-contain">
        <Header
          title={data.title}
          view={this.props.view}
          studentName={data.studentName}
        />
        <div className="skip-button">
          <button
            onClick={() => { this.analyticTable.focus(); }}
          >
            Skip to Table
          </button>
        </div>
        { graph }
        <div className="table-scroll">
          <AnalyticList
            tableData={data.analyticsTable}
            view={this.props.view}
            tableRef={this.tableRef}
          />
        </div>
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
