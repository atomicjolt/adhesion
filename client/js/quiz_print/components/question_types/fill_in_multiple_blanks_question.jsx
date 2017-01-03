import React    from 'react';
import _        from 'lodash';

export default function fillInMultipleBlanks(props) {
  const input = '<input type="text" class="textbox" />';
  const questionText = _.replace(props.question_text, /\[.+?]/g, input);

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: questionText }} />
    </div>
  );
}

fillInMultipleBlanks.propTypes = {
  question_text: React.PropTypes.string,
};
