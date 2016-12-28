import React       from 'react';
import TestUtils   from 'react-addons-test-utils';
import HoverButton from './hover_button';

describe('hover button', () => {
  let result;

  beforeEach(() => {
    const props = {
      onClick: () => {},
      style: {
        color: 'white',
      },
      hoveredStyle: {
        color: 'black',
      },
    };
    result = TestUtils.renderIntoDocument(<HoverButton {...props} />);
  });

  it('applies the correct styles when you hover', () => {
    const element = TestUtils.findRenderedDOMComponentWithTag(result, 'button');
    expect(element.getAttribute('style')).toContain('white');
    TestUtils.Simulate.mouseEnter(element);
    expect(element.getAttribute('style')).toContain('black');
  });
});
