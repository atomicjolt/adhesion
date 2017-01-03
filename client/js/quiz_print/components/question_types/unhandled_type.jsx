import React    from 'react';

export default function unhandledType(props) {
  return (
    <div>{props.question_type} is not implemented yet.</div>
  );
}

unhandledType.propTypes = {
  question_type: React.PropTypes.string.isRequired,
};
