import React             from 'react';
import moment            from 'moment';
import _                 from 'lodash';
import Defines           from '../../defines';
import HoverButton       from '../common/hover_button';
import PopupMenu         from './popup_menu';
import MessageInstructor from './message_instructor';

export default class ProctorCode extends React.Component {
  static propTypes = {
    assignedExam: React.PropTypes.shape({}),
    proctorCode: React.PropTypes.shape({}),
    sendMessage: React.PropTypes.func.isRequired,
  }

  constructor() {
    super();
    this.state = {
      opened: false,
      messageOpened: false,
    };
  }

  getStyles() {
    return {
      td: {
        textAlign: 'left',
        padding: '20px 20px',
        borderBottom: `1px solid ${Defines.lightGrey}`,
        color: Defines.darkGrey,
        verticalAlign: 'top',
        backgroundColor: this.state.opened ? Defines.lightGrey : 'white',
        position: 'relative'
      },
      bigAndBold: {
        fontWeight: 'bold',
        fontSize: '1.2em',
      },
      largeFont: {
        fontSize: '1.2em',
      },
      button: {
        float: 'right',
        color: this.state.opened ? Defines.darkGrey : Defines.lightGrey,
        backgroundColor: 'white',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1.8em',
      },
      hoveredStyle: {
        color: Defines.darkGrey,
      },
      status: {
        width: '80%',
        float: 'left',
      },
      popupMenu: {
        position: 'absolute',
        top: '63px',
        right: '20px',
        zIndex: '1',
      },
    };
  }

  iconClick() {
    this.setState({ opened: !this.state.opened });
  }

  sendMessage(body, subject) {
    this.props.sendMessage(
      this.props.assignedExam.instructor_id,
      body,
      subject,
    );
    this.props.hideModal();
  }

  openMessageModal() {
    this.setState({ 
      opened: !this.state.opened,
    });
    this.props.showModal(<MessageInstructor 
      sendMessage={(body, subject) => this.sendMessage(body, subject)}
      closeMessageModal={() => this.props.hideModal()}
    />);
  };

  render() {
    const styles = this.getStyles();
    const { assignedExam, proctorCode } = this.props;
    return (
      <tr>
        <td style={styles.td}>
          <div style={styles.bigAndBold}>{assignedExam.student_name}</div>
          <div>{assignedExam.student_id}</div>
        </td>
        <td style={styles.td}>
          <div style={styles.largeFont}>{assignedExam.exam_name}</div>
          <div>{assignedExam.course_name}</div>
          <div>{assignedExam.instructor_name}</div>
          <div>{moment(proctorCode.created_at).format('DD MMM YY H:m')}</div>
        </td>
        <td style={styles.td}>
          <div style={styles.largeFont}>
            {proctorCode.code}
          </div>
        </td>
        <td style={styles.td}>
          <div style={styles.status}>
            <div style={styles.bigAndBold}>{_.capitalize(assignedExam.status)}</div>
            <div>{/* the date will go here */}</div>
          </div>
          <HoverButton
            style={styles.button}
            onClick={e => this.iconClick(e)}
            hoveredStyle={styles.hoveredStyle}
          >
            <i className="material-icons">settings</i>
          </HoverButton>
          {
            this.state.opened ?
              <PopupMenu 
                style={styles.popupMenu} 
                status={assignedExam.status} 
                openMessageModal={() => this.openMessageModal()}
              /> : null
          }
        </td>
      </tr>
    );
  }
}
