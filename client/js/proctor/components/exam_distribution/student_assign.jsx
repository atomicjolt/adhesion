import React        from 'react';
import _            from 'lodash';
import moment       from 'moment';
import SelectSearch from 'react-select-search';
import Defines      from '../../defines';
import HoverButton  from '../common/hover_button';

export default class StudentAssign extends React.Component {
  static propTypes = {
    student: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      id: React.PropTypes.number.isRequired,
    }).isRequired,
    testingCenterList: React.PropTypes.shape({}),
    assignExam: React.PropTypes.func.isRequired,
    assignedExam: React.PropTypes.shape({
      status: React.PropTypes.string.isRequired,
      testing_center_id: React.PropTypes.number.isRequired,
      created_at: React.PropTypes.string.isRequired,
    }),
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

  constructor(props) {
    super(props);
    const { assignedExam } = props;
    const selectedCenterId = assignedExam ? assignedExam.testing_center_id : null;
    this.state = {
      selectedCenterId,
    };
  }

  getOptions() {
    return _.map(this.props.testingCenterList, center => ({
      name: center.name,
      value: `${center.id}`,
    }));
  }

  getStatus() {
    if (this.props.assignedExam) {
      return _.capitalize(this.props.assignedExam.status);
    }
    return 'Unassigned';
  }

  assignExam(studentId, centerId) {
    this.props.assignExam(studentId, centerId);
  }

  changeOption(option) {
    this.setState({ selectedCenterId: option.value });
  }

  render() {
    const styles = StudentAssign.getStyles();
    let assignObject;
    if (this.state.selectedCenterId != null && !this.props.assignedExam) {
      assignObject = (
        <HoverButton
          style={styles.button}
          hoveredStyle={styles.hoveredStyle}
          onClick={() => this.assignExam(this.props.student.id, this.state.selectedCenterId)}
        >
          Assign
        </HoverButton>
      );
    }

    if (this.props.assignedExam) {
      assignObject = (
        <div>
          <div>{this.props.assignedExam.created_at}</div>
          <div>Instructor Name!!!!</div>
        </div>
      );
    }

    let selectSearch = ' - ';

    if (!_.isEmpty(this.props.testingCenterList)) {
      const selectSearchProps = {
        options: this.getOptions(),
        onChange: option => this.changeOption(option),
        placeholder: 'Select a testing center',
      };

      if (this.state.selectedCenterId) {
        selectSearchProps.value = `${this.state.selectedCenterId}`;
      }

      selectSearch = (
        <SelectSearch {...selectSearchProps} />
      );
    }

    return (
      <tr>
        <td style={styles.td}>{this.props.student.name}</td>
        <td style={styles.td}>
          {selectSearch}
        </td>
        <td style={styles.td}>
          {assignObject}
        </td>
        <td style={styles.td}> - </td>
        <td style={styles.td}> {this.getStatus()} </td>
      </tr>
    );
  }
}
