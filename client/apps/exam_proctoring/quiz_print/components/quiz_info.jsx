import React    from 'react';
import PropTypes from 'prop-types';

export default function quizInfo(props) {
  // TODO: we may want more of the quiz info displayed

  return (
    <h2>{props.title}</h2>
  );
}

quizInfo.propTypes = {
  title: PropTypes.string,
};
