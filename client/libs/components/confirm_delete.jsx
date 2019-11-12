import React from 'react';
import PropTypes from 'prop-types';
import Defines from '../defines';
import HoverButton from './hover_button';

const confirmDelete = (props) => {
  const styles = {
    popupStyle: {
      boxShadow: `0px 0px 5px ${Defines.darkGrey}`,
      backgroundColor: 'white',
      padding: '25px',
      position: 'fixed',
      top: '5vh',
      left: '25vw',
      right: '25vw',
      zIndex: '2',
      color: Defines.darkGrey,
    },
    buttonStyle: {
      backgroundColor: Defines.tanishBrown,
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      cursor: 'pointer',
      float: 'right',
    },
    cancelButton: {
      backgroundColor: Defines.lightBackground,
      color: Defines.darkGrey,
      marginRight: '20px'
    },
    buttonContainer: {
      marginTop: '20px'
    },
  };

  return (
    <div style={styles.popupStyle}>
      <h2>Are you sure?</h2>
      <div style={styles.buttonContainer}>
        <HoverButton
          style={styles.buttonStyle}
          onClick={props.handleRemove}
        >
          DELETE
        </HoverButton>
        <HoverButton
          style={{ ...styles.buttonStyle, ...styles.cancelButton }}
          onClick={props.closeModal}
        >
          CANCEL
        </HoverButton>
      </div>
    </div>
  );
};

confirmDelete.propTypes = {
  closeModal: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
};

export default confirmDelete;
