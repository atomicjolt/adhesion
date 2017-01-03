import React                      from 'react';
import TestUtils                  from 'react-addons-test-utils';
import SearchBar                  from './search_bar';

describe('search bar', () => {
  let result;
  let changed = false;
  beforeEach(() => {
    const props = {
      searchChange: () => { changed = true; }
    };
    result = TestUtils.renderIntoDocument(<SearchBar {...props} />);
  });

  it('typing calls the change callback', () => {
    const textField = TestUtils.findRenderedDOMComponentWithTag(result, 'input');
    TestUtils.Simulate.change(textField);
    expect(changed).toBe(true);
  });
});
