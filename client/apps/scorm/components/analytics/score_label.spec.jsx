import React from 'react';
import TestUtils from 'react-addons-test-utils';
import Stub from '../../../../specs_support/stub';
import ScoreLabel from './score_label';

describe('Scorm Analytics ScoreLabel', () => {

  let result;
  const props = {
    name: 'test application',
    value: '12',
  };

  beforeEach(() => {
    result = TestUtils.renderIntoDocument(
      <Stub>
        <ScoreLabel {...props} />
      </Stub>
    );
  });

  it('renders the scores label with the correct values', () => {
    const div =  TestUtils.findRenderedDOMComponentWithClass(result, 'c-aa-label');
    expect(div.textContent).toContain(props.name);
    expect(div.textContent).toContain(props.value);
  });
});
