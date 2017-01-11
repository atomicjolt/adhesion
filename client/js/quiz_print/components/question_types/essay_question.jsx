import React    from 'react';
import Text     from './question_text';

export default function essayQuestion(props) {
  return (
    <div>
      <Text text={props.question_text} />
      <textarea className="textbox" rows="10" style={{ width: '98%' }} disabled />
    </div>
  );
}

essayQuestion.propTypes = {
  question_text: React.PropTypes.string,
};
