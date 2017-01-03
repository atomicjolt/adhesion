import React    from 'react';

export default function shortAnswerQuestion(props) {
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: props.question_text }} />
      <input type="text" className="textbox" />
    </div>
  );
}

shortAnswerQuestion.propTypes = {
  question_text: React.PropTypes.string,
};
