import React    from 'react';

export default function quizInfo(props) {
  // TODO: we may want more of the quiz info displayed

  return (
    <h2>{props.title}</h2>
  );
}

quizInfo.propTypes = {
  title: React.PropTypes.string,
};
