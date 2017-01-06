import React    from 'react';
import Defines  from '../../defines';

export default function confirmTakeExam(props) {
  const styles = {
    popup: {
      boxShadow: `0px 0px 5px ${Defines.darkGrey}`,
      backgroundColor: 'white',
      padding: '20px',
      position: 'fixed',
      top: '10vh',
      bottom: '65vh',
      left: '20vw',
      right: '20vw',
      borderRadius: '5px',
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
        style={styles.button}
        onClick={() => props.closeModal()}
      >
        Cancel
      </button>
      <button
        style={{ ...styles.button, ...styles.confirm }}
        onClick={() => props.takeExam()}
      >
        Begin Quiz
      </button>
    </div>
  );
}

confirmTakeExam.propTypes = {
  takeExam: React.PropTypes.func.isRequired,
  closeModal: React.PropTypes.func.isRequired,
};
