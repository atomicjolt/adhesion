import React     from 'react';
import TestUtils from 'react-addons-test-utils';
import Stub      from '../../../../specs_support/stub';
import TimeSelector from './time_selector';

describe('Center Time Selector', () => {

  it('renders a dropdown', () => {
    const result = TestUtils.renderIntoDocument(<Stub><TimeSelector /></Stub>);
    const dropdown = TestUtils.scryRenderedDOMComponentsWithClass(result, 'Dropdown-root');
    expect(dropdown.length).toBe(1);
    const options = TestUtils.scryRenderedDOMComponentsWithClass(result, 'Dropdown-option');
    expect(options.length).toBe(0);
  });

  it('renders a dropdown with values', () => {
    const props = {
      style: {},
      header: 'Header',
      value: { value: 'default', label: 'Default' },
      onChange: () => {},
    };
    const result = TestUtils.renderIntoDocument(<Stub><TimeSelector {...props} /></Stub>);
    const dropdown = TestUtils.findRenderedDOMComponentWithClass(result, 'Dropdown-root');
    expect(dropdown).toBeDefined();
  });
});
