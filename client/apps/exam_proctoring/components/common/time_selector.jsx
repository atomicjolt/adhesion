import React    from 'react';
import Dropdown from 'react-accessible-dropdown';
import _        from 'lodash';

export default class TimeSelector extends React.Component {
  static propTypes = {
    onChange: React.PropTypes.func,
    value: React.PropTypes.shape({}),
    style: React.PropTypes.shape({}),
    header: React.PropTypes.node,
  }

  static getTimes() {
    const times = [];
    for (let i = 0; i < 24; i += 1) {
      times.push(i + '00');
      times.push(i + '15');
      times.push(i + '30');
      times.push(i + '45');
    }
    return _.map(times, (time) => {
      if (time.length === 3) {
        return `0${time}`;
      }
      return `${time}`;
    });
  }

  render() {
    return (
      <div style={this.props.style}>
        {this.props.header}
        <Dropdown
          options={TimeSelector.getTimes()}
          onChange={this.props.onChange}
          value={this.props.value}
        />
      </div>
    );
  }
}
