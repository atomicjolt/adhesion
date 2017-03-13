import React                               from 'react';
import { connect }                         from 'react-redux';
import { hashHistory }                     from 'react-router';
import ChartContainer                      from './chart_container';
import NavContainer                        from './nav_container';
import RegList                             from './registration_list';
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
      selectedChart: 'Completed',
    };
  }

  componentWillMount() {
    this.props.loadCourseData(this.props.scormCourseId);
  }

  render() {
    const data = this.props.data || {};

    return (
      <div className="c-aa-contain">
        <header className="c-aa-head">
          <a
            className="c-aa-back-btn"
            onClick={() => hashHistory.push('/')}
          >
            <i className="material-icons">arrow_back</i>
          </a>
          <h1 className="c-aa-title">{data.title} Analytics</h1>
        </header>

        <div className="c-aa-graph-picker">
          <div className="c-aa-graph-nav">
            <NavContainer
              data={data}
              switchChart={label => this.setState({ selectedChart: label })}
            />
          </div>
          <div className="c-aa-graph-container">
            <ChartContainer
              data={data}
              selected={this.state.selectedChart}
            />
          </div>
        </div>
        <RegList
          regList={data.regDetails}
        />
      </div>
    );
  }
}

const select = (state, props) => ({
  scormCourseId: props.params.courseId,
  data: state.analytics.data,
});

export default connect(select, AnalyticsActions)(CourseReport);
