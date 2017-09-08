import React    from 'react';

export default function essayQuestion(props) {
  const text = props.text || props.question_text;

  return <div dangerouslySetInnerHTML={{ __html: text }} />; // eslint-disable-line react/no-danger
}

essayQuestion.propTypes = {
  text: React.PropTypes.string,
  question_text: React.PropTypes.string,
};
