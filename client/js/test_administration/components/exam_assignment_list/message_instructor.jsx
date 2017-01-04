import React        from 'react';
import Defines      from '../../defines';
import HoverButton  from '../common/hover_button';

export default class MessageInstructor extends React.Component {
  static propTypes = {
    sendMessage: React.PropTypes.func.isRequired,
    closeMessageModal: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.textArea = null;
    this.subjectField =  null;
  }
  render() {
    const popupStyle = {
      boxShadow: `0px 0px 5px ${Defines.darkGrey}`,
      backgroundColor: 'white',
      padding: '20px',
      position: 'fixed',
      top: '10vh',
      bottom: '10vh',
      left: '10vw',
      right: '10vw',
      borderRadius: '5px',
    };

    const subjectBox = {
      flex: '1',
      marginTop: '20px',
      fontSize: '1.1em',
      padding: '5px',
      borderRadius: '3px',
      border: 'solid lightgrey 2px',
    };

    const textBox = {
      flex: '1',
      marginTop: '20px',
      marginBottom: '20px',
      border: 'solid lightgrey 2px',
      borderRadius: '3px',
      focus: 'top',
    };

    const flex = {
      display: 'flex',
    };

    const buttonStyle = {
      backgroundColor: Defines.tanishBrown,
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      cursor: 'pointer',
    };

    const exitButtonStyle = {
      ...buttonStyle,
      backgroundColor: 'white',
      color: Defines.lightText,
      position: 'absolute',
      top: '20px',
      right: '20px',
      padding: '0px',
    };

    return(
      <div style={popupStyle}>
        Message to the Instructor
        <HoverButton
          className="spec_clear_button"
          style={exitButtonStyle}
          onClick={() => this.props.closeMessageModal()} >
          <i className="material-icons">clear</i>
        </HoverButton>
        <div style={{ clear: 'both' }} />
        <div style={flex}>
          <input
            style={subjectBox}
            type="textarea"
            placeholder="Subject"
            name="message"
            ref={(el) => { this.subjectField = el }}
          />
        </div>
        <div style={flex}>
          <textarea
            rows="25"
            style={textBox}
            placeholder="Please include the student's name here"
            name="message"
            ref={(el) => { this.textArea = el }}
          />
        </div>
        <HoverButton
          style={buttonStyle}
          onClick={() => this.props.sendMessage(
            this.textArea.value,
            this.subjectField.value,
          )}
          className="send_btn_spec"
        >
          <i className="material-icons">send</i>
        </HoverButton>
      </div>
    )
  }
}
