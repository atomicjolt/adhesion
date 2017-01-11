import React    from 'react';
import _        from 'lodash';
import Text     from './question_text';

export default function multipleAnswerQuestion(props) {
  return (
    <div>
      <Text text={props.question_text} />
      {
        _.map(props.answers, answer => (
          <div key={`question${props.id}_answer${answer.id}`}>
            <hr />
            <input type="checkbox" disabled /> {answer.text}
          </div>
        ))
      }
    </div>
  );
}

multipleAnswerQuestion.propTypes = {
  answers: React.PropTypes.arrayOf(React.PropTypes.shape({})),
  question_text: React.PropTypes.string,
  id: React.PropTypes.number,
};
