import React    from 'react';
import PropTypes from 'prop-types';

import MultipleChoice   from './multiple_choice_question';
import MultipleAnswer   from './multiple_answers_question';
import ShortAnswer      from './short_answer_question';
import FillInBlanks     from './fill_in_multiple_blanks_question';
import MultipleDropdown from './multiple_dropdowns_question';
import Matching         from './matching_question';
import Essay            from './essay_question';
import TextOnly         from './question_text';

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
    case 'true_false_question':
      Question = MultipleChoice;
      break;
    case 'multiple_answers_question':
      Question = MultipleAnswer;
      break;
    case 'short_answer_question':
    case 'numerical_question':
    case 'calculated_question':
      Question = ShortAnswer;
      break;
    case 'fill_in_multiple_blanks_question':
      Question = FillInBlanks;
      break;
    case 'multiple_dropdowns_question':
      Question = MultipleDropdown;
      break;
    case 'matching_question':
      Question = Matching;
      break;
    case 'essay_question':
      Question = Essay;
      break;
    case 'text_only_question':
    case 'file_upload_question':
    default:
      Question = TextOnly;
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
  question_type: PropTypes.string,
  position: PropTypes.number,
  points_possible: PropTypes.number,
};
