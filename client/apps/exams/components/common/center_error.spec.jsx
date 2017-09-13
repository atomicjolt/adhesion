import React     from 'react';
import TestUtils from 'react-addons-test-utils';
import CenterError  from './center_error';
import Stub      from '../../../../specs_support/stub';

describe('Center Error', () => {
  it('renders a "Error Message" message', () => {
    const result = TestUtils.renderIntoDocument(<Stub><CenterError /></Stub>);
    const element = TestUtils.findRenderedDOMComponentWithTag(result, 'h1');
    expect(element.textContent).toContain('Error Loading Testing Centers');
  });
});
