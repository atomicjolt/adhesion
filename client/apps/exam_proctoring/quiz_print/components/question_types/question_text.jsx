import React    from 'react';
import PropTypes from 'prop-types';

export default function essayQuestion(props) {
  const text = props.text || props.question_text;

  return <div dangerouslySetInnerHTML={{ __html: text }} />; // eslint-disable-line react/no-danger
}

essayQuestion.propTypes = {
  text: PropTypes.string,
  question_text: PropTypes.string,
};
