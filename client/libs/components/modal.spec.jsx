import React       from 'react';
import ReactTestUtils   from 'react-dom/test-utils';
import Modal       from './modal';

describe('modal', () => {
  let result;

  beforeEach(() => {
    const props = {
      visible: true,
      children: <h1>Hello World</h1>
    };
    result = ReactTestUtils.renderIntoDocument(<Modal {...props} />);
  });

  it('applies the correct styles when you hover', () => {
    const element = ReactTestUtils.findRenderedDOMComponentWithTag(result, 'h1');
    expect(element.textContent).toContain('Hello World');
  });
});
