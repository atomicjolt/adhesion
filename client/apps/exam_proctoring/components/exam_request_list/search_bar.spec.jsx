import React                      from 'react';
import ReactTestUtils                  from 'react-dom/test-utils';
import SearchBar                  from './search_bar';

describe('search bar', () => {
  let result;
  let changed = false;
  beforeEach(() => {
    const props = {
      searchChange: () => { changed = true; }
    };
    result = ReactTestUtils.renderIntoDocument(<SearchBar {...props} />);
  });

  it('typing calls the change callback', () => {
    const textField = ReactTestUtils.findRenderedDOMComponentWithTag(result, 'input');
    ReactTestUtils.Simulate.change(textField);
    expect(changed).toBe(true);
  });
});
