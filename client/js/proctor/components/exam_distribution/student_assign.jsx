import React       from 'react';
import _            from 'lodash';
import SelectSearch from 'react-select-search';
import Defines     from '../../defines';

export default class StudentAssign extends React.Component {
  static propTypes = {
    student: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      // id: React.PropTypes.number.isRequired,
    }),
    centers: React.PropTypes.arrayOf(React.PropTypes.shape({})),
  }

  static getStyles() {
    return {
      td: {
        textAlign: 'left',
        padding: '20px 20px',
        borderBottom: `1px solid ${Defines.lightGrey}`,
        color: Defines.darkGrey,
      },
    };
  }

  getOptions() {
    return _.map(this.props.centers, center => ({
      name: center.name,
      value: center.id,
    }));
  }

  render() {
    const styles = StudentAssign.getStyles();
    return (
      <tr>
        <td style={styles.td}>{this.props.student.name}</td>
        <td style={styles.td}><SelectSearch options={this.getOptions()} /></td>
        <td style={styles.td}>AssignButton</td>
        <td style={styles.td}> - </td>
        <td style={styles.td}> Unchanged </td>
      </tr>
    );
  }
}
