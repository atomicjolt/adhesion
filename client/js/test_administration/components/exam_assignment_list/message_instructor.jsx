import React        from 'react';
import Defines      from '../../defines';
import HoverButton  from '../common/hover_button';

export default class MessageInstructor extends React.Component {
  constructor(props) {
    super(props);
    this.textArea = null;
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
      marginTop: '20px',
    };

    const textBox = {
      width: '500px',
      marginTop: '20px',
      marginBottom: '20px',
      border: 'solid grey 2px',
      focus: 'top',
      padding: '5px 5px 400px 5px',
    };

    return(
      <div style={popupStyle}>
        Message to the Instructor
        <br />
        <input
          style={subjectBox}
          type={'textarea'}
          placeholder="Subject"
          name={'message'}
          ref={(el) => { this.textArea = el }}
        />
        <br />
        <input 
          style={textBox}
          type={'textarea'}
          name={'message'}
          ref={(el) => { this.textArea = el }}
        />
        <br />
        <HoverButton onClick={() => this.props.sendMessage(this.textArea.value)}>
          Send
        </HoverButton>
        <HoverButton onClick={() => this.props.closeMessageModal()} >
          Cancel
        </HoverButton>
      </div>
    )
  }
}
