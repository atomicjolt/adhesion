import React    from 'react';

export default function essayQuestion(props) {
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: props.question_text }} />
    </div>
  );
}

essayQuestion.propTypes = {
  question_text: React.PropTypes.string,
};
