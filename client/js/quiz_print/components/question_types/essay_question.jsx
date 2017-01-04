import React    from 'react';

export default function essayQuestion(props) {
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: props.question_text }} />
      <textarea className="textbox" rows="10" style={{ width: '98%' }} />
    </div>
  );
}

essayQuestion.propTypes = {
  question_text: React.PropTypes.string,
};