import React    from 'react';
import PropTypes from 'prop-types';
import _        from 'lodash';
import Text     from './question_text';

export default function fillInMultipleBlanks(props) {
  const input = '<input type="text" class="textbox" disabled />';
  const questionText = _.replace(props.question_text, /\[.+?]/g, input);

  return <Text text={questionText} />;
}

fillInMultipleBlanks.propTypes = {
  question_text: PropTypes.string,
};
