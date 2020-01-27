import React        from 'react';
import PropTypes from 'prop-types';
import Defines      from '../../defines';
import HoverButton  from '../common/hover_button';

export default class NewProctorCode extends React.Component {
  static propTypes = {
    hideModal: PropTypes.func.isRequired,
    code: PropTypes.string.isRequired,
  };

  static getStyles() {
    return {
      popupStyle: {
        boxShadow: `0px 0px 5px ${Defines.darkGrey}`,
        backgroundColor: 'white',
        padding: '20px',
        position: 'fixed',
        top: '10vh',
        bottom: '50vh',
        left: '10vw',
        right: '10vw',
        borderRadius: '5px',
        zIndex: '2',
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
      message: {
        textAlign: 'center',
        color: Defines.darkGrey,
      },
      code: {
        fontSize: '3em',
        border: `1px solid ${Defines.lightText}`,
        borderRadius: '2px'
      }
    };
  }


  render() {
    const styles = NewProctorCode.getStyles();
    return (
      <div style={styles.popupStyle}>
        New proctor code
        <HoverButton
          className="spec_clear_button qa-clear-button"
          style={styles.exitButtonStyle}
          onClick={this.props.hideModal}
        >
          <i className="material-icons">clear</i>
        </HoverButton>
        <div style={{ clear: 'both' }} />
        <div style={styles.message}>
          <h1>Your proctor code is: </h1>
          <h2 style={styles.code}>{this.props.code}</h2>
          <div>Please write this down as you will not be able to retrieve it again</div>
        </div>
      </div>
    );
  }
}
