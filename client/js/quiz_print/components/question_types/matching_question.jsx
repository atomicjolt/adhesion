import React    from 'react';
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
  answers: React.PropTypes.arrayOf(React.PropTypes.shape({})),
  matches: React.PropTypes.arrayOf(React.PropTypes.shape({})),
  question_text: React.PropTypes.string,
  id: React.PropTypes.number,
};
