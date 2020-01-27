import React    from 'react';
import PropTypes from 'prop-types';
import Text     from './question_text';

export default function shortAnswerQuestion(props) {
  return (
    <div>
      <Text text={props.question_text} />
      <input type="text" className="textbox" disabled />
    </div>
  );
}

shortAnswerQuestion.propTypes = {
  question_text: PropTypes.string,
};
