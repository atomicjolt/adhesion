import React     from 'react';
import TestUtils from 'react-addons-test-utils';
import ClickableTableRow  from './clickable_table_row';
import Stub      from '../../../../specs_support/stub';

describe('Clickable Table Row', () => {
  let props;
  let result;
  let clicked = false;

  beforeEach(() => {
    props = {
      style: { display: 'block' },
      hoveredStyle: { color: 'green' },
      onClick: () => { clicked = true; },
    };
    result = TestUtils.renderIntoDocument(<Stub><ClickableTableRow {...props} /></Stub>);
  });

  it('renders the table row with the correct style', () => {
    const elements = TestUtils.scryRenderedDOMComponentsWithTag(result, 'tr');
    expect(elements.length).toBe(1);
  });

  it('renders the table row with the correct style', () => {
    const tr = TestUtils.findRenderedDOMComponentWithTag(result, 'tr');
    expect(tr.style.cssText).toBe('display: block;');
  });

  it('renders the table row with the correct style', () => {
    const tr = TestUtils.findRenderedDOMComponentWithTag(result, 'tr');
    TestUtils.Simulate.click(tr);
    expect(clicked).toBeTruthy();
  });

  it('renders the table row with the correct style', () => {
    const tr = TestUtils.findRenderedDOMComponentWithTag(result, 'tr');
    TestUtils.Simulate.mouseEnter(tr);
    expect(tr.style.cssText).toBe('display: block; color: green;');
  });
});
