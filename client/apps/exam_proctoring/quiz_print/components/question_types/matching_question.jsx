import React    from 'react';
import PropTypes from 'prop-types';
import _        from 'lodash';
import Text     from './question_text';

export default function matchingQuestion(props) {
  const styles = {
    columns: {
      display: 'inline-block'
    },
    rightFloat: {
      float: 'right',
    },
    answer: {
      border: '1px solid darkGray',
      margin: '5px',
      padding: '5px',
    }
  };

  return (
    <div>
      <Text text={props.question_text} />
      <div style={styles.columns}>
        {
          _.map(props.answers, answer => (
            <div key={`question${props.id}_answer${answer.id}`} style={styles.answer}>
              {answer.text}
            </div>
          ))
        }
      </div>
      <div style={{ ...styles.columns, ...styles.rightFloat }}>
        {
          _.map(props.matches, answer => (
            <div key={`question${props.id}_match${answer.match_id}`} style={styles.answer}>
              {answer.text}
            </div>
          ))
        }
      </div>
    </div>
  );
}

matchingQuestion.propTypes = {
  answers: PropTypes.arrayOf(PropTypes.shape({})),
  matches: PropTypes.arrayOf(PropTypes.shape({})),
  question_text: PropTypes.string,
  id: PropTypes.number,
};
