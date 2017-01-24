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
    unassignExam: React.PropTypes.func.isRequired,
    reassignExam: React.PropTypes.func.isRequired,
    assignedExam: React.PropTypes.shape({
      status: React.PropTypes.string.isRequired,
      id: React.PropTypes.number.isRequired,
    }),
  };

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
      },
      unassignButton: {
        border: 'none',
        backgroundColor: 'transparent',
        color: 'blue',
        textDecoration: 'underline',
        cursor: 'pointer',
      }
    };
  }

  constructor(props) {
    super(props);
    const { assignedExam } = props;
    const selectedCenterId = assignedExam ? _.toString(assignedExam.testing_center_id) : null;
    this.state = {
      selectedCenterId,
    };
  }

  componentWillUpdate(nextProps) {
    if (!this.props.assignedExam && nextProps.assignedExam) {
      this.setState({ selectedCenterId: _.toString(nextProps.assignedExam.testing_center_id) });
    }
  }

  getOptions() {
    return _.map(this.props.testingCenterList, center => ({
      name: center.name,
      value: _.toString(center.id),
    }));
  }

  getStatus() {
    if (this.props.assignedExam) {
      return _.capitalize(this.props.assignedExam.status);
    }
    return 'Unassigned';
  }

  changeOption(option) {
    this.setState({ selectedCenterId: option.value });
  }

  unassign(id) {
    this.props.unassignExam(id);
    this.setState({ selectedCenterId: null });
  }

  render() {
    const styles = StudentAssign.getStyles();
    const { assignedExam, testingCenterList, student } = this.props;
    const { selectedCenterId } = this.state;
    let assignObject;

    if (this.state.selectedCenterId != null && !assignedExam) {
      assignObject = (
        <HoverButton
          style={styles.button}
          hoveredStyle={styles.hoveredStyle}
          onClick={() => this.props.assignExam(
            student,
            selectedCenterId,
            testingCenterList[selectedCenterId].name
          )}
        >
          Assign
        </HoverButton>
      );
    }
    const stringId = assignedExam ? _.toString(assignedExam.testing_center_id) : null;
    if (assignedExam && this.state.selectedCenterId !== stringId) {
      assignObject = (
        <HoverButton
          style={styles.button}
          hoveredStyle={styles.hoveredStyle}
          onClick={() => this.props.reassignExam(
            assignedExam.id,
            selectedCenterId,
            testingCenterList[selectedCenterId].name
          )}
        >
          Reassign
        </HoverButton>
      );
    } else if (assignedExam) {
      const date = moment(assignedExam.updated_at).format('DD MMM YY H:m');
      assignObject = (
        <div>
          <div style={{ fontSize: '1.1em' }}>{date.toUpperCase()}</div>
          <div>{assignedExam.instructor_name}</div>
        </div>
      );
    }


    let selectSearch;

    if (!_.isEmpty(this.props.testingCenterList)) {
      const selectSearchProps = {
        options: this.getOptions(),
        onChange: option => this.changeOption(option),
        placeholder: 'Select a testing center',
        value: this.state.selectedCenterId,
      };

      selectSearch = (
        <SelectSearch {...selectSearchProps} />
      );
    }

    return (
      <tr>
        <td style={styles.td}>{student.name}</td>
        <td style={styles.td}>
          {selectSearch}
        </td>
        <td style={styles.td}>
          {assignObject}
        </td>
        <td style={styles.td}> - </td>
        <td style={styles.td}>
          {this.getStatus()}
          {
            assignedExam && assignedExam.status === 'assigned' ?
              <div>
                <button
                  onClick={() => this.unassign(assignedExam.id)}
                  style={styles.unassignButton}
                >
                  Unassign
                </button>
              </div> : null
          }
        </td>
      </tr>
    );
  }
}
