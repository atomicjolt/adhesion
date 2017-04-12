import React from 'react';
import TestUtils from 'react-addons-test-utils';
import Stub from '../../../../specs_support/stub';
import FilterTabs from './filter_tabs';

describe('Center Filter Tabs', () => {
  let result;
  let props;

  it('renders the buttons', () => {
    const number = 3;
    const props = {
      selectedTab: 'hey',
      changeTab: () => {},
      unscheduledCount: number,
    };
    const result = TestUtils.renderIntoDocument(<Stub><FilterTabs {...props} /></Stub>);
    const buttons = TestUtils.scryRenderedDOMComponentsWithTag(result, 'button');
    expect(buttons.length).toBe(3);
    expect(buttons[0].textContent).toBe(`Unscheduled (${number})`);
    expect(buttons[1].textContent).toBe(`Date`);
    expect(buttons[2].textContent).toBe(`All`);
  });

  it('renders the buttons', () => {
    const number = 3;
    let changedTabType = '';
    const props = {
      selectedTab: 'hey',
      changeTab: (type) => { changedTabType = type; },
      unscheduledCount: number,
    };
    const result = TestUtils.renderIntoDocument(<Stub><FilterTabs {...props} /></Stub>);
    const buttons = TestUtils.scryRenderedDOMComponentsWithTag(result, 'button');
    expect(buttons.length).toBe(3);
    const button = TestUtils.Simulate.click(buttons[0]);
    expect(changedTabType).toBe('unscheduled');
    const button1 = TestUtils.Simulate.click(buttons[1]);
    expect(changedTabType).toBe('date');
    const button2 = TestUtils.Simulate.click(buttons[2]);
    expect(changedTabType).toBe('all');
  });
});
