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

    return(
      <div style={popupStyle}>
        Check me out
        <br />
        <input 
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
