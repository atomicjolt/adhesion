import React        from 'react';
import PropTypes from 'prop-types';
import Defines      from '../../defines';
import HoverButton  from '../common/hover_button';

export default class MessageStudent extends React.Component {
  static propTypes = {
    sendMessage: PropTypes.func.isRequired,
    closeMessageModal: PropTypes.func.isRequired,
  };

  static getStyles() {
    return {
      popupStyle: {
        boxShadow: `0px 0px 5px ${Defines.darkGrey}`,
        backgroundColor: 'white',
        padding: '20px',
        position: 'fixed',
        top: '10vh',
        bottom: '10vh',
        left: '10vw',
        right: '10vw',
        borderRadius: '5px',
        zIndex: '2',
      },
      subjectBox: {
        flex: '1',
        marginTop: '20px',
        fontSize: '1.1em',
        padding: '5px',
        borderRadius: '3px',
        border: 'solid lightgrey 2px',
      },
      textBox: {
        flex: '1',
        marginTop: '20px',
        marginBottom: '20px',
        border: 'solid lightgrey 2px',
        borderRadius: '3px',
        focus: 'top',
      },
      flex: {
        display: 'flex',
      },
      buttonStyle: {
        backgroundColor: Defines.tanishBrown,
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        cursor: 'pointer',
      },
      exitButtonStyle: {
        border: 'none',
        cursor: 'pointer',
        backgroundColor: 'white',
        color: Defines.lightText,
        position: 'absolute',
        top: '20px',
        right: '20px',
        padding: '0px',
      },
    };
  }

  constructor(props) {
    super(props);
    this.textArea = null;
    this.subjectField =  null;
  }

  render() {
    const styles = MessageStudent.getStyles();
    return (
      <div style={styles.popupStyle}>
        Message to the Student
        <HoverButton
          className="spec_clear_button qa-clear-btn"
          style={styles.exitButtonStyle}
          onClick={() => this.props.closeMessageModal()}
        >
          <i className="material-icons">clear</i>
        </HoverButton>
        <div style={{ clear: 'both' }} />
        <div style={styles.flex}>
          <input
            className="qa-subject-box"
            style={styles.subjectBox}
            type="textarea"
            placeholder="Subject"
            name="message"
            ref={(el) => { this.subjectField = el; }}
          />
        </div>
        <div style={styles.flex}>
          <textarea
            className="qa-message-box"
            rows="25"
            style={styles.textBox}
            name="message"
            ref={(el) => { this.textArea = el; }}
          />
        </div>
        <HoverButton
          className="qa-send-btn"
          style={styles.buttonStyle}
          onClick={() => this.props.sendMessage(
            this.textArea.value,
            this.subjectField.value,
          )}
          className="send_btn_spec"
        >
          <i className="material-icons">send</i>
        </HoverButton>
      </div>
    );
  }
}
