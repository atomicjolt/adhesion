import React    from 'react';
import PropTypes from 'prop-types';
import Defines  from '../../defines';

export default function confirmTakeExam(props) {
  const styles = {
    popup: {
      boxShadow: `0px 0px 5px ${Defines.darkGrey}`,
      backgroundColor: 'white',
      padding: '20px',
      position: 'fixed',
      top: '10vh',
      left: '20vw',
      right: '20vw',
      borderRadius: '5px',
      zIndex: '2',
    },
    button: {
      backgroundColor: Defines.lightGrey,
      border: 'none',
      padding: '10px 20px',
      cursor: 'pointer',
    },
    confirm: {
      backgroundColor: Defines.tanishBrown,
      float: 'right',
      color: 'white',
    },
    text: {
      marginBottom: '20px',
    }
  };

  return (
    <div style={styles.popup}>
      <h2>Are you sure?</h2>
      <div style={styles.text}>
        You are about to begin a quiz on the behalf of a student.
        This action will save the attempt and scores of the quiz attempt to the students account.
        You will be recorded as the proctor who entered the answers.
        Time limits, shuffled questions, and other factors will still apply.
        Only select Begin Quiz if you are prepared to enter answers for this student.
      </div>
      <button
        className="qa-cancel-take-exam"
        style={styles.button}
        onClick={() => props.closeModal()}
      >
        Cancel
      </button>
      <button
        className="qa-begin-take-exam"
        style={{ ...styles.button, ...styles.confirm }}
        onClick={() => props.takeExam()}
      >
        Begin Quiz
      </button>
    </div>
  );
}

confirmTakeExam.propTypes = {
  takeExam: PropTypes.func.isRequired,
};
