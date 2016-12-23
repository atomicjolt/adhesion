import React        from 'react';
import _            from 'lodash';
import SelectSearch from 'react-select-search';
import Defines      from '../../defines';
import HoverButton  from '../common/hover_button';

export default class StudentAssign extends React.Component {
  static propTypes = {
    student: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      id: React.PropTypes.number.isRequired,
    }).isRequired,
    centers: React.PropTypes.arrayOf(React.PropTypes.shape({})),
    assignExam: React.PropTypes.func.isRequired
  }

  static getStyles() {
    return {
      td: {
        textAlign: 'left',
        padding: '20px 20px',
        borderBottom: `1px solid ${Defines.lightGrey}`,
        color: Defines.darkGrey,
      },
      button: {
        border: 'none',
        backgroundColor: Defines.tanishBrown,
        padding: '12px 20px',
        color: 'white',
        fontSize: '1em',
        cursor: 'pointer'
      },
      hoveredStyle: {
        opacity: '0.8',
      }
    };
  }

  constructor() {
    super();
    this.state = {
      selectedCenterId: null,
    };
  }

  getOptions() {
    return _.map(this.props.centers, center => ({
      name: center.name,
      value: center.id,
    }));
  }

  changeOption(option) {
    this.setState({ selectedCenterId: option.value });
  }

  assignExam(studentId, centerId){
    this.props.assignExam(studentId, centerId);
  }

  render() {
    const styles = StudentAssign.getStyles();

    let assignButton;
    if (this.state.selectedCenterId != null) {
      assignButton = (
        <HoverButton
          style={styles.button}
          hoveredStyle={styles.hoveredStyle}
          onClick={() => this.assignExam(this.props.student.id, this.state.selectedCenterId)}
        >
          Assign
        </HoverButton>
      );
    }

    return (
      <tr>
        <td style={styles.td}>{this.props.student.name}</td>
        <td style={styles.td}>
          <SelectSearch
            options={this.getOptions()}
            onChange={option => this.changeOption(option)}
            placeholder="Select a testing center"
          />
        </td>
        <td style={styles.td}>
          {assignButton}
        </td>
        <td style={styles.td}> - </td>
        <td style={styles.td}> Unchanged </td>
      </tr>
    );
  }
}
