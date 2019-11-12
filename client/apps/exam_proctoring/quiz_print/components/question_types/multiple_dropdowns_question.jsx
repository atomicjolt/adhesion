import React    from 'react';
import PropTypes from 'prop-types';
import _        from 'lodash';
import Text     from './question_text';

export default function multipleDropdowns(props) {
  // TODO use this or something to make this look nice
  // const input = '<input type="text" class="textbox" />';
  // const questionText = _.replace(props.question_text, /\[.+?]/g, input);

  const styles = {
    bank: {
      display: 'inline-block',
      border: '1px solid darkGrey',
      padding: '5px',
      margin: '5px',
      verticalAlign: 'top',
    }
  };

  const answers = {};

  _.forEach(props.answers, (answer) => {
    if (!answers[answer.blank_id]) {
      answers[answer.blank_id] = {};
    }
    answers[answer.blank_id][answer.id] = answer;
  });

  return (
    <div>
      <Text text={props.question_text} />
      {
        _.map(answers, (bank, key) => (
          <div key={`answer_bank_${key}`} style={styles.bank}>
            <strong>{key}</strong>
            <hr />
            {
            _.map(bank, answer => (
              <div key={`dropdown_answer_${answer.id}`}>
                <input type="radio" disabled /> {answer.text}
              </div>
            ))
            }
          </div>
        ))
      }
    </div>
  );
}

multipleDropdowns.propTypes = {
  question_text: PropTypes.string,
  answers: PropTypes.arrayOf(PropTypes.shape({})),
};
