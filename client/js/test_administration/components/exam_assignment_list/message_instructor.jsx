import React        from 'react';
import Defines      from '../../defines';
import HoverButton  from '../common/hover_button';

export default class MessageInstructor extends React.Component {
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

    return(
      <div style={popupStyle}>
        Message to the Instructor
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
            name="message"
            ref={(el) => { this.textArea = el }}
          />
        </div>
        <HoverButton onClick={() => this.props.sendMessage(
          this.textArea.value,
          this.subjectField.value,
        )}>
          Send
        </HoverButton>
        <HoverButton onClick={() => this.props.closeMessageModal()} >
          Cancel
        </HoverButton>
      </div>
    )
  }
}
