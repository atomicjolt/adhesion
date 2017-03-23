import React              from 'react';
import { connect }        from 'react-redux';
import _                  from 'lodash';
import AnalyticRow        from './analytic_row';
import { switchView }     from '../../actions/analytics';

export class AnalyticList extends React.Component {

  static propTypes = {
    switchView: React.PropTypes.func.isRequired,
    tableData: React.PropTypes.array,
    view: React.PropTypes.string,
  }

  constructor() {
    super();
    this.state = {
      analyticsName: '',
      parents: {},
    };
  }
  componentWillMount() {
    this.setAnalyticsName(this.props.view);
    this.setParent(this.props.tableData);
  }

  componentWillReceiveProps(nextProps) {
    this.setAnalyticsName(nextProps.view);
    this.setParent(nextProps.tableData);
  }

  setAnalyticsName(view) {
    if (view === 'course') {
      this.setState({ analyticsName: 'Student' });
    } else {
      this.setState({ analyticsName: 'Activity' });
    }
  }

  setParent(tableData) {
    let parents = {}
    parents = _.map(_.filter(tableData, 'isParent'), reg => {
      let data = {};
      data['id'] = reg.id;
      data['show'] = true;
      return data;
    });
    this.setState({ parents });
  }

  toggleHideShow(id) {
    let parents = this.state.parents;
    let data = _.find(parents, {'id': id});
    data.show = !data.show;
    this.setState({ parents });
  }

  switchTable(viewId) {
    if (viewId) {
      this.props.switchView('student', viewId);
    }
  }

  render() {
    return (
      <table className="c-aa-table">
        <thead>
          <tr>
            <th>{this.state.analyticsName}</th>
            <th>Passed</th>
            <th>AVG Score</th>
            <th>Total Time(mins)</th>
          </tr>
        </thead>
        <tbody>
          {
            _.map(this.props.tableData, (reg, key) => (
              <AnalyticRow
                key={key}
                id={parseInt(reg.id, 10)}
                name={reg.name}
                passed={reg.passed}
                score={reg.score}
                time={reg.time}
                show={_.find(this.state.parents, {'id': reg.parentId}) ? (_.find(this.state.parents, {'id': reg.parentId})).show : true}
                isParent={reg.isParent}
                depth={reg.depth}
                switchTable={this.switchTable.bind(this)}
                toggleHideShow={this.toggleHideShow.bind(this)}
              />
            ))
          }
        </tbody>
      </table>
    );
  }
}

const select = state => ({
  view: state.analytics.view,
});

export default connect(select, { switchView })(AnalyticList);
