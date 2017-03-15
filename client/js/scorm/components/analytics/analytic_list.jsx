import React              from 'react';
import { connect }        from 'react-redux';
import _                  from 'lodash';
import AnalyticRow        from './analytic_row';
import { switchView }     from '../../actions/analytics';

export class AnalyticList extends React.Component {

  static propTypes = {
    switchView: React.PropTypes.func.isRequired,
    regList: React.PropTypes.array,
  }

  constructor() {
    super();
    this.state = {
      analyticsName: 'Student',
    };
  }

  switchTable(viewId) {
    this.props.switchView(this.state.analyticsName.toLowerCase(), viewId);
    if(this.state.analyticsName == 'Student'){
      this.setState({ analyticsName: 'Assignment' });
    } else {
      this.setState({ analyticsName: 'Student' });
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
            <th>AVG Time(mins)</th>
          </tr>
        </thead>
        <tbody>
          {
            _.map(this.props.regList, (reg, key) => (
              <AnalyticRow
                key={key}
                id={reg.id}
                name={reg.name}
                passed={reg.passed}
                score={ reg.score}
                time={reg.time}
                switchTable={this.switchTable.bind(this)}/>
            ))
          }
        </tbody>
      </table>
    );
  }
}

const select = (state, props) => ({
  view: state.analytics.view,
});

export default connect(select, {switchView})(AnalyticList);
