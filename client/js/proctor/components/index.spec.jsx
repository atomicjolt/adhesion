import React            from 'react';
import TestUtils        from 'react-addons-test-utils';
import Index     from './index';
import Stub             from '../../../specs_support/stub';

describe('index', () => {
  let result;

  beforeEach(() => {
    const props = {
      children: 'america'
    };
    result = TestUtils.renderIntoDocument(<Stub><Index {...props} /></Stub>);
  });

  it('renders the children', () => {
    const element = TestUtils.scryRenderedDOMComponentsWithTag(result, 'div')[0];
    expect(element.textContent).toContain('america');
  });
});
