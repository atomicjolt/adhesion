import React    from 'react';
import PropTypes from 'prop-types';
import _        from 'lodash';
import Text     from './question_text';

export default function multipleChoiceQuestion(props) {
  return (
    <div>
      <Text text={props.question_text} />
      {
        _.map(props.answers, answer => (
          <div key={`question${props.id}_answer${answer.id}`}>
            <hr />
            <input type="radio" disabled /> {answer.text}
          </div>
        ))
      }
    </div>
  );
}

multipleChoiceQuestion.propTypes = {
  answers: PropTypes.arrayOf(PropTypes.shape({})),
  question_text: PropTypes.string,
  id: PropTypes.number,
};
