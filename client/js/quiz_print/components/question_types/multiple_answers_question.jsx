import React    from 'react';
import _        from 'lodash';

export default function multipleAnswerQuestion(props) {
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: props.question_text }} />
      {
        _.map(props.answers, answer => (
          <div key={`question${props.id}_answer${answer.id}`}>
            <hr />
            <input type="checkbox" /> {answer.text}
          </div>
        ))
      }
    </div>
  );
}

multipleAnswerQuestion.propTypes = {
  answers: React.PropTypes.arrayOf({}),
  question_text: React.PropTypes.string,
  id: React.PropTypes.number,
};