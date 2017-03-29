import React           from 'react';
import TestUtils       from 'react-addons-test-utils';
import _               from 'lodash';
import Stub            from '../../../../specs_support/stub';
import AverageScore    from './average_score';

describe('Scorm Analytics Average Score', () => {

  let result;
  const props = {
    meanScore: 12,
    medScore: 15,
    lowScore: 18,
    highScore: 20,
  };
  beforeEach(() => {
    result = TestUtils.renderIntoDocument(
      <Stub>
        <AverageScore {...props} />
      </Stub>
    );
  });

  it('renders the average score with the correct mean values', () => {
    const divs = TestUtils.scryRenderedDOMComponentsWithClass(result, 'c-aa-label');
    expect(_.size(divs)).toBe(4);
    expect(divs[0].textContent).toContain('Mean Score');
    expect(divs[0].textContent).toContain(props.meanScore);
  });

  it('renders the scores with the correct other values', () => {
    const divs = TestUtils.scryRenderedDOMComponentsWithClass(result, 'c-aa-label');
    expect(divs[1].textContent).toContain(props.medScore);
    expect(divs[2].textContent).toContain(props.lowScore);
    expect(divs[3].textContent).toContain(props.highScore);
  });
});
