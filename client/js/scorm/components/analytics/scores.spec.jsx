import React from 'react';
import TestUtils from 'react-addons-test-utils';
import Stub from '../../../../specs_support/stub';
import Scores from './scores';

describe('Scorm Analytics Scores', () => {

  let result;
  const props = {
    scores: [
      {
        name: 'test application',
        value: '12',
      },
    ],
  };

  beforeEach(() => {
    result = TestUtils.renderIntoDocument(
      <Stub>
        <Scores {...props} />
      </Stub>
    );
  });

  it('renders the scores with the correct values', () => {
    const div =  TestUtils.findRenderedDOMComponentWithClass(result, 'c-aa-label');
    expect(div.textContent).toContain(props.scores[0].name);
    expect(div.textContent).toContain(props.scores[0].value);
  });
});
