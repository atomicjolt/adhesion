import React    from 'react';
import Text     from './question_text'

export default function shortAnswerQuestion(props) {
  return (
    <div>
      <Text text={props.question_text} />
      <input type="text" className="textbox" />
    </div>
  );
}

shortAnswerQuestion.propTypes = {
  question_text: React.PropTypes.string,
};
