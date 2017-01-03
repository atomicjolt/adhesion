import React    from 'react';

import Unhandled        from './question_types/unhandled_type';
import MultipleChoice   from './question_types/multiple_choice_question';

export default function question(props) {
  const styles = {
    item: {
      border: 'solid 1px black',
      margin: '20px 5px',
    },
    title: {
      borderBottom: 'solid 1px black',
      // TODO: this should be in a defines
      backgroundColor: 'Gainsboro',
      padding: '10px'
    },
    points: {
      // I am open to suggestions
      float: 'right'
    },
    question: {
      padding: '10px',
    }
  };

  let Question;
  switch (props.question_type) {
    case 'multiple_choice_question':
      Question = MultipleChoice;
      break;

    default:
      Question = Unhandled;
      break;
  }

  return (
    <div style={styles.item}>
      <div style={styles.title}>
        Question {props.position}
        <span style={styles.points}>{props.points_possible} pts</span>
      </div>
      <div style={styles.question}>
        <Question {...props} />
      </div>
    </div>
  );
}

question.propTypes = {
  question_type: React.PropTypes.string,
  position: React.PropTypes.number,
  points_possible: React.PropTypes.number,
};
